// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 10000;

// ---------- Database Connection ----------
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool
  .query("SELECT 1")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });

app.use(cors());
app.use(express.json());

// ---------- Health Route ----------
app.get("/", (req, res) => {
  res.send("Inventory backend is running");
});

// ---------- One-time Setup Route ----------
// Call this once: POST /api/setup
// It will create tables and insert sample data.
app.post("/api/setup", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        buying_price INTEGER NOT NULL,
        selling_price INTEGER NOT NULL,
        stock INTEGER NOT NULL,
        low_stock_threshold INTEGER NOT NULL DEFAULT 5
      );
    `);

    // Sales table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        sold_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    // Clear old sample data
    await client.query("DELETE FROM sales;");
    await client.query("DELETE FROM products;");

    // Insert sample products
    await client.query(`
      INSERT INTO products (name, category, buying_price, selling_price, stock, low_stock_threshold)
      VALUES
        ('Dell Inspiron Laptop 14"', 'Laptops', 52000, 62000, 8, 3),
        ('HP Pavilion Laptop 15"', 'Laptops', 48000, 58000, 4, 3),
        ('Samsung Galaxy A55', 'Mobiles', 26000, 30500, 12, 4),
        ('Redmi Note 13 Pro', 'Mobiles', 19000, 22999, 3, 4),
        ('Logitech Wireless Mouse M185', 'Accessories', 450, 799, 25, 5),
        ('Dell Wireless Keyboard', 'Accessories', 900, 1499, 5, 5),
        ('Office Chair Ergonomic', 'Furniture', 3200, 4499, 6, 3),
        ('Gaming Chair High Back', 'Furniture', 7200, 9999, 2, 3),
        ('HP LaserJet Printer', 'Printers', 8200, 10499, 7, 3),
        ('A4 Paper Pack 500 Sheets', 'Stationery', 210, 349, 40, 10);
    `);

    // Insert sample sales for dashboard numbers
    await client.query(`
      INSERT INTO sales (product_id, quantity, total_amount)
      SELECT id, 2, 2 * selling_price FROM products LIMIT 5;
    `);

    await client.query("COMMIT");
    res.json({ ok: true, message: "Setup completed with sample data" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Setup error:", err);
    res.status(500).json({ ok: false, error: err.message });
  } finally {
    client.release();
  }
});

// ---------- Products API ----------

// GET /api/products  → Products page + dropdowns
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, buying_price, selling_price, stock, low_stock_threshold
       FROM products
       ORDER BY name ASC;`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST /api/products  → Optional: add new product from UI
app.post("/api/products", async (req, res) => {
  const {
    name,
    category,
    buying_price,
    selling_price,
    stock,
    low_stock_threshold,
  } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO products (name, category, buying_price, selling_price, stock, low_stock_threshold)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [
        name,
        category,
        buying_price,
        selling_price,
        stock,
        low_stock_threshold ?? 5,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /api/products error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// ---------- Sales API ----------

// GET /api/sales → Sales history (for Sales page list)
app.get("/api/sales", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT s.id,
             s.product_id,
             p.name AS product_name,
             s.quantity,
             s.total_amount,
             s.sold_at
      FROM sales s
      JOIN products p ON p.id = s.product_id
      ORDER BY s.sold_at DESC
      LIMIT 50;
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /api/sales error:", err);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

// POST /api/sales → Create a sale from Sales page
app.post("/api/sales", async (req, res) => {
  const { product_id, quantity } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Get product info
    const productRes = await client.query(
      "SELECT id, selling_price, stock FROM products WHERE id = $1;",
      [product_id]
    );

    if (productRes.rows.length === 0) {
      throw new Error("Product not found");
    }

    const product = productRes.rows[0];

    if (product.stock < quantity) {
      throw new Error("Not enough stock");
    }

    const totalAmount = product.selling_price * quantity;

    // Insert sale
    const saleResult = await client.query(
      `
      INSERT INTO sales (product_id, quantity, total_amount)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [product_id, quantity, totalAmount]
    );

    // Update stock
    await client.query(
      `
      UPDATE products
      SET stock = stock - $1
      WHERE id = $2;
      `,
      [quantity, product_id]
    );

    await client.query("COMMIT");
    res.status(201).json(saleResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("POST /api/sales error:", err);
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ---------- Dashboard Summary API ----------

// GET /api/dashboard/summary → Dashboard top cards + charts
app.get("/api/dashboard/summary", async (req, res) => {
  try {
    const totalProductsRes = await pool.query(
      "SELECT COUNT(*)::int AS count FROM products;"
    );

    const lowStockRes = await pool.query(
      "SELECT COUNT(*)::int AS count FROM products WHERE stock <= low_stock_threshold;"
    );

    const revenueRes = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0)::int AS revenue FROM sales;"
    );

    const profitRes = await pool.query(
      `
      SELECT COALESCE(SUM(s.total_amount - (p.buying_price * s.quantity)), 0)::int AS profit
      FROM sales s
      JOIN products p ON p.id = s.product_id;
      `
    );

    res.json({
      totalProducts: totalProductsRes.rows[0].count,
      lowStockItems: lowStockRes.rows[0].count,
      totalRevenue: revenueRes.rows[0].revenue,
      totalProfit: profitRes.rows[0].profit,
    });
  } catch (err) {
    console.error("GET /api/dashboard/summary error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
});

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
