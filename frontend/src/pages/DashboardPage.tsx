import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mockProducts } from "../mock/inventory";

type Sale = {
  id: number;
  productId: number;
  productName: string;
  customerName: string;
  units: number;
  amount: number;
};

type Customer = {
  id: number;
  name: string;
};

const mockCustomers: Customer[] = [
  { id: 1, name: "99Store" },
  { id: 2, name: "MK Tech" },
  { id: 3, name: "Rajesh Kumar" },
  { id: 4, name: "Atul Ltd." },
  { id: 5, name: "Amit" },
];

const mockSales: Sale[] = [
  {
    id: 1,
    productId: 1,
    productName: "Dell Inspiron Laptop",
    customerName: "99Store",
    units: 2,
    amount: 120000,
  },
  {
    id: 2,
    productId: 2,
    productName: "Samsung Galaxy A55",
    customerName: "MK Tech",
    units: 3,
    amount: 75000,
  },
  {
    id: 3,
    productId: 3,
    productName: "Office Chair",
    customerName: "Rajesh Kumar",
    units: 4,
    amount: 28000,
  },
  {
    id: 4,
    productId: 4,
    productName: "HP Printer",
    customerName: "99Store",
    units: 1,
    amount: 18000,
  },
  {
    id: 5,
    productId: 5,
    productName: "Logitech Wireless Mouse",
    customerName: "Amit",
    units: 5,
    amount: 15000,
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const lowStockThreshold = 5;

  const summary = useMemo(() => {
    const totalProducts = mockProducts.length;
    const totalCustomers = mockCustomers.length;

    const lowStockCount = mockProducts.filter(
      (p) => p.stockQuantity <= lowStockThreshold
    ).length;

    const totalStockValue = mockProducts.reduce(
      (sum, p) => sum + p.stockQuantity * p.buyingPrice,
      0
    );

    const totalSalesAmount = mockSales.reduce(
      (sum, s) => sum + s.amount,
      0
    );

    const purchaseAmount = totalStockValue;
    const profitLoss = totalSalesAmount - purchaseAmount;

    const productMap = new Map<
      string,
      { units: number; amount: number }
    >();
    mockSales.forEach((sale) => {
      const key = sale.productName;
      const existing = productMap.get(key) || { units: 0, amount: 0 };
      existing.units += sale.units;
      existing.amount += sale.amount;
      productMap.set(key, existing);
    });

    const topProducts = Array.from(productMap.entries())
      .map(([name, v]) => ({ name, units: v.units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    const customerMap = new Map<string, number>();
    mockSales.forEach((sale) => {
      const key = sale.customerName;
      customerMap.set(key, (customerMap.get(key) || 0) + sale.amount);
    });

    const topCustomers = Array.from(customerMap.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const stockBars = mockProducts.map((p) => ({
      name: p.name,
      stock: p.stockQuantity,
    }));

    const lowStockNotifications = mockProducts
      .filter((p) => p.stockQuantity <= lowStockThreshold)
      .map(
        (p) =>
          `${p.name} needs re-order. Stock: ${p.stockQuantity} units.`
      );

    return {
      totalProducts,
      totalCustomers,
      lowStockCount,
      totalStockValue,
      totalSalesAmount,
      purchaseAmount,
      profitLoss,
      topProducts,
      topCustomers,
      stockBars,
      lowStockNotifications,
    };
  }, []);

  const handleProductsClick = () => navigate("/products");
  const handleLowStockClick = () => navigate("/products?filter=low-stock");
  const handleSalesClick = () => navigate("/sales");

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Inventory Management Dashboard</h1>
        <p className="page-subtitle">
          Overview of products, customers, purchases, sales and stock
          value.
        </p>
      </div>

      <div className="dashboard-kpi-row">
        <button
          type="button"
          className="card card-clickable dashboard-kpi-card"
          onClick={handleProductsClick}
        >
          <div className="card-label">Products</div>
          <div className="card-value">{summary.totalProducts}</div>
        </button>

        <div className="card dashboard-kpi-card">
          <div className="card-label">Customers</div>
          <div className="card-value">{summary.totalCustomers}</div>
        </div>

        <button
          type="button"
          className="card card-clickable dashboard-kpi-card"
          onClick={handleSalesClick}
        >
          <div className="card-label">Sales Amount</div>
          <div className="card-value">
            ₹{summary.totalSalesAmount.toLocaleString("en-IN")}
          </div>
        </button>

        <div className="card dashboard-kpi-card">
          <div className="card-label">Profit / Loss</div>
          <div
            className="card-value"
            style={{
              color: summary.profitLoss >= 0 ? "#16a34a" : "#b91c1c",
            }}
          >
            ₹{summary.profitLoss.toLocaleString("en-IN")}
          </div>
        </div>

        <button
          type="button"
          className="card card-clickable dashboard-kpi-card"
          onClick={handleLowStockClick}
        >
          <div className="card-label">Low Stock Items</div>
          <div className="card-value">{summary.lowStockCount}</div>
        </button>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-main-column">
          <div className="card chart-card">
            <div className="chart-title">Top 5 Selling Products</div>
            <div className="chart-body">
              {summary.topProducts.map((item) => (
                <div className="chart-row" key={item.name}>
                  <div className="chart-label">{item.name}</div>
                  <div className="chart-bar">
                    <div
                      className="chart-bar-fill"
                      style={{ width: `${item.units * 10}%` }}
                    />
                  </div>
                  <div className="chart-value">{item.units}</div>
                </div>
              ))}
              {summary.topProducts.length === 0 && (
                <div className="chart-empty">No sales data yet.</div>
              )}
            </div>
          </div>

          <div className="card chart-card">
            <div className="chart-title">Stock Available</div>
            <div className="chart-body">
              {summary.stockBars.map((item) => (
                <div className="chart-row" key={item.name}>
                  <div className="chart-label">{item.name}</div>
                  <div className="chart-bar">
                    <div
                      className="chart-bar-fill chart-bar-fill-stock"
                      style={{ width: `${item.stock * 5}%` }}
                    />
                  </div>
                  <div className="chart-value">{item.stock}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-side-column">
          <div className="card chart-card">
            <div className="chart-title">Top Customers</div>
            <div className="chart-body">
              {summary.topCustomers.map((item) => (
                <div className="chart-row" key={item.name}>
                  <div className="chart-label">{item.name}</div>
                  <div className="chart-bar">
                    <div
                      className="chart-bar-fill chart-bar-fill-customers"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="chart-value">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
              {summary.topCustomers.length === 0 && (
                <div className="chart-empty">No customer data yet.</div>
              )}
            </div>
          </div>

          <div className="card notifications-card">
            <div className="chart-title">Notifications</div>
            <div className="notifications-body">
              {summary.lowStockNotifications.length === 0 && (
                <div className="notification-item">
                  All products are healthy on stock.
                </div>
              )}
              {summary.lowStockNotifications.map((msg, idx) => (
                <div className="notification-item" key={idx}>
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="alert-bar">
        Data is currently based on sample products and sample sales. When
        the backend is connected, this dashboard can read live metrics
        from the database.
      </div>
    </div>
  );
    }
