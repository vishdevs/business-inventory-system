import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mockProducts, Product } from "../mock/inventory";

type Sale = {
  id: number;
  invoice: string;
  customer: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending";
};

const mockSales: Sale[] = [
  {
    id: 1,
    invoice: "#INV-1023",
    customer: "Aarav Shah",
    date: "Today · 10:21",
    amount: 12500,
    status: "Paid",
  },
  {
    id: 2,
    invoice: "#INV-1022",
    customer: "Greenfield Stores",
    date: "Today · 09:10",
    amount: 58900,
    status: "Paid",
  },
  {
    id: 3,
    invoice: "#INV-1021",
    customer: "Urban Mart",
    date: "Yesterday",
    amount: 24800,
    status: "Paid",
  },
  {
    id: 4,
    invoice: "#INV-1020",
    customer: "Riya Desai",
    date: "2 days ago",
    amount: 8200,
    status: "Pending",
  },
];

const revenueTrendSample = [32, 52, 44, 78, 61, 55];

const DashboardPage: React.FC = () => {
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    // small delay for chart animation
    const t = setTimeout(() => setAnimateChart(true), 150);
    return () => clearTimeout(t);
  }, []);

  // ------- Derived metrics from mock data -------

  const totalProducts = mockProducts.length;

  const lowStockItems = useMemo(
    () => mockProducts.filter((p) => p.stock <= 5).length,
    []
  );

  const todayRevenue = useMemo(
    () => mockSales.reduce((sum, sale) => sum + sale.amount, 0),
    []
  );

  const averageOrderValue =
    mockSales.length > 0 ? Math.round(todayRevenue / mockSales.length) : 0;

  const totalOrders = mockSales.length;

  const topProducts = useMemo(() => {
    // simple "by sellingPrice * stock" ranking for demo
    const ranked: { product: Product; revenue: number }[] = mockProducts.map(
      (p) => ({
        product: p,
        revenue: p.sellingPrice * p.stock,
      })
    );

    ranked.sort((a, b) => b.revenue - a.revenue);
    return ranked.slice(0, 5);
  }, []);

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  return (
    <div className="page dashboard-page">
      {/* Top bar with title and quick actions */}
      <div className="dashboard-header-row">
        <div className="page-header">
          <h1>Overview</h1>
          <p>Daily snapshot of revenue, orders and inventory health.</p>
        </div>

        <div className="dashboard-header-actions">
          <div className="dashboard-pill-group">
            <button className="dashboard-pill dashboard-pill-active">
              Today
            </button>
            <button className="dashboard-pill">This week</button>
            <button className="dashboard-pill">This month</button>
          </div>
          <button className="dashboard-export-btn">Download report</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-row">
        <div className="kpi-card kpi-card-hover">
          <div className="kpi-label">Total revenue (today)</div>
          <div className="kpi-value">{formatCurrency(todayRevenue)}</div>
          <div className="kpi-sub">From all recorded orders</div>
          <div className="kpi-trend kpi-trend-up">▲ +12.4% vs yesterday</div>
        </div>

        <div className="kpi-card kpi-card-hover">
          <div className="kpi-label">Orders</div>
          <div className="kpi-value">{totalOrders}</div>
          <div className="kpi-sub">Completed invoices</div>
          <div className="kpi-trend kpi-trend-neutral">→ Stable volume</div>
        </div>

        <div className="kpi-card kpi-card-hover">
          <div className="kpi-label">Avg. order value</div>
          <div className="kpi-value">{formatCurrency(averageOrderValue)}</div>
          <div className="kpi-sub">Across today&apos;s orders</div>
          <div className="kpi-trend kpi-trend-up">▲ 5.2% vs last week</div>
        </div>

        <div className="kpi-card kpi-card-hover">
          <div className="kpi-label">Low stock items</div>
          <div className="kpi-value kpi-danger">{lowStockItems}</div>
          <div className="kpi-sub">Need restock soon</div>
          <div className="kpi-trend kpi-trend-down">▼ Restocked yesterday</div>
        </div>
      </div>

      {/* Revenue chart + Recent activity */}
      <div className="grid-2">
        {/* Revenue overview */}
        <div className="card">
          <div className="card-header">
            <span>Revenue overview</span>
            <span className="card-meta">Sample chart · frontend only</span>
          </div>

          <div className="dashboard-chart">
            <div className="chart-bars">
              {revenueTrendSample.map((h, idx) => (
                <div key={idx} className="chart-bar">
                  <div
                    className={
                      idx === revenueTrendSample.length - 1
                        ? "chart-bar-fill chart-bar-fill-accent"
                        : "chart-bar-fill"
                    }
                    style={{
                      height: animateChart ? `${h}%` : "0%",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="chart-footer">
              <div>
                <div className="summary-label">Today</div>
                <div className="summary-value">
                  {formatCurrency(todayRevenue)}
                </div>
              </div>
              <div>
                <div className="summary-label">This week (est.)</div>
                <div className="summary-value">{formatCurrency(545000)}</div>
              </div>
              <div>
                <div className="summary-label">Refund rate</div>
                <div className="summary-value">1.4%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity + quick nav */}
        <div className="card">
          <div className="card-header">
            <span>Recent activity</span>
            <span className="card-meta">Latest 4 invoices · no backend</span>
          </div>

          <div className="recent-list">
            {mockSales.map((sale) => (
              <div key={sale.id} className="recent-row">
                <div className="recent-main">
                  <div className="recent-id">{sale.invoice}</div>
                  <div className="recent-name">{sale.customer}</div>
                </div>
                <div className="recent-meta">
                  <span className="recent-date">{sale.date}</span>
                  <span className="recent-amount">
                    {formatCurrency(sale.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="recent-footer">
            <Link to="/sales" className="link-button">
              Go to sales
            </Link>
          </div>
        </div>
      </div>

      {/* Top products table */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-header">
          <span>Top products by revenue</span>
          <span className="card-meta">Static demo data · no backend</span>
        </div>

        <table className="simple-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Revenue (est.)</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((item, index) => (
              <tr key={item.product.id}>
                <td>
                  <span className="table-rank">{index + 1}</span>
                  {item.product.name}
                </td>
                <td>{item.product.category}</td>
                <td>{formatCurrency(item.revenue)}</td>
                <td>{item.product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick navigation to other pages */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-header">
          <span>Quick access</span>
          <span className="card-meta">
            Open the main pages directly from the dashboard.
          </span>
        </div>

        <div className="dashboard-quick-grid">
          <Link to="/products" className="quick-card">
            <div className="quick-label">Products</div>
            <div className="quick-title">Product inventory</div>
            <div className="quick-subtitle">
              View, search and manage available items.
            </div>
          </Link>

          <Link to="/sales" className="quick-card">
            <div className="quick-label">Sales</div>
            <div className="quick-title">Sales & invoices</div>
            <div className="quick-subtitle">
              Create new orders and track performance.
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
