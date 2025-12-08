import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ---------- Health ---------- */
app.get("/", (req, res) => {
  res.send("Inventory backend is running");
});

/* ---------- ONE-TIME SETUP ---------- */
app.post("/api/setup", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        buying_price NUMERIC NOT NULL,
        selling_price NUMERIC NOT NULL,
        stock INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        customer_name TEXT NOT NULL,
        total_amount NUMERIC NOT NULL,
        status TEXT DEFAULT 'PAID',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS sale_items (
        id SERIAL PRIMARY KEY,
        sale_id INTEGER REFERENCES sales(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price NUMERIC NOT NULL
      );
    `);

    await client.query(`
      INSERT INTO products (name, category, buying_price, selling_price, stock)
      VALUES
        ('Dell Inspiron 14"', 'Laptops', 52000, 62000, 8),
        ('HP Pavilion 15', 'Laptops', 48000, 58000, 4),
        ('Samsung Galaxy A55', 'Mobiles', 26000, 30500, 12),
        ('Redmi Note 13 Pro', 'Mobiles', 19000, 22999, 3),
        ('Logitech Mouse', 'Accessories', 450, 799, 25)
      ON CONFLICT DO NOTHING;
    `);

    await client.query("COMMIT");
    res.json({ ok: true, message: "Setup completed" });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ ok: false, error: "Setup failed" });
  } finally {
    client.release();
  }
});

/* ---------- PRODUCTS ---------- */
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        category,
        buying_price  AS "buyingPrice",
        selling_price AS "sellingPrice",
        stock
      FROM products
      ORDER BY id ASC
    `);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* ---------- SALES ---------- */
app.post("/api/sales", async (req, res) => {
  const { customerName, items } = req.body;
  if (!customerName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid sale data" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    let totalAmount = 0;

    for (const item of items) {
      const pr = await client.query(
        "SELECT selling_price, stock FROM products WHERE id=$1",
        [item.productId]
      );
      if (pr.rowCount === 0) throw new Error("Product not found");
      if (item.quantity > pr.rows[0].stock)
        throw new Error("Insufficient stock");

      totalAmount += Number(pr.rows[0].selling_price) * item.quantity;

      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.productId]
      );
    }

    const sale = await client.query(
      "INSERT INTO sales (customer_name, total_amount) VALUES ($1,$2) RETURNING *",
      [customerName, totalAmount]
    );

    for (const item of items) {
      await client.query(
        "INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES ($1,$2,$3,(SELECT selling_price FROM products WHERE id=$2))",
        [sale.rows[0].id, item.productId, item.quantity]
      );
    }

    await client.query("COMMIT");
    res.json({ ok: true, saleId: sale.rows[0].id });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

/* ---------- DASHBOARD SUMMARY ---------- */
app.get("/api/dashboard/summary", async (req, res) => {
  try {
    const revenue = await pool.query(
      "SELECT COALESCE(SUM(total_amount),0) AS total FROM sales"
    );
    const orders = await pool.query("SELECT COUNT(*) AS count FROM sales");
    const lowStock = await pool.query(
      "SELECT COUNT(*) AS count FROM products WHERE stock <= 5"
    );

    res.json({
      totalRevenue: Number(revenue.rows[0].total),
      ordersToday: Number(orders.rows[0].count),
      lowStockItems: Number(lowStock.rows[0].count)
    });
  } catch {
    res.status(500).json({ error: "Dashboard error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
