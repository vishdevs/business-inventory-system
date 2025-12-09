import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
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

  // Small delay for chart animation
  useEffect(() => {
    const t = setTimeout(() => setAnimateChart(true), 150);
    return () => clearTimeout(t);
  }, []);

  // Backend connection test (console only)
  useEffect(() => {
    api
      .get("/")
      .then((res) => {
        console.log("✅ Backend connected:", res.data);
      })
      .catch((err) => {
        console.error("❌ Backend error:", err);
      });
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

  const recentSales = mockSales;

  // ------- Render -------

  return (
    <div className="page">
      {/* Header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Inventory Dashboard</h1>
          <p className="page-subtitle">
            Monitor products, stock health and daily sales in one place.
          </p>
        </div>
        <div className="page-header-actions">
          <Link to="/sales" className="btn btn-primary">
            + New Invoice
          </Link>
          <Link to="/products" className="btn btn-outline">
            View Products
          </Link>
        </div>
      </header>

      {/* KPI cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{totalProducts}</div>
          <div className="stat-subtitle">Active items in catalogue</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Low Stock Items</div>
          <div className="stat-value stat-danger">{lowStockItems}</div>
          <div className="stat-subtitle">Need restocking soon</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Today&apos;s Revenue</div>
          <div className="stat-value">₹{todayRevenue.toLocaleString()}</div>
          <div className="stat-subtitle">From all recorded invoices</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Average Order Value</div>
          <div className="stat-value">
            ₹{averageOrderValue.toLocaleString()}
          </div>
          <div className="stat-subtitle">Across {totalOrders} orders</div>
        </div>
      </section>

      {/* Main content grid */}
      <div className="dashboard-grid">
        {/* Revenue trend */}
        <section className="card chart-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Revenue trend</h2>
              <p className="card-subtitle">Sample last 6 days</p>
            </div>
          </div>

          <div className="chart-bars">
            {revenueTrendSample.map((value, idx) => (
              <div key={idx} className="chart-bar-wrapper">
                <div
                  className={`chart-bar ${
                    animateChart ? "chart-bar-animate" : ""
                  }`}
                  style={{ height: `${value}%` }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Recent sales */}
        <section className="card table-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Recent invoices</h2>
              <p className="card-subtitle">Latest recorded sales</p>
            </div>
            <Link to="/sales" className="card-link">
              View all
            </Link>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.invoice}</td>
                    <td>{sale.customer}</td>
                    <td>{sale.date}</td>
                    <td className="text-right">
                      ₹{sale.amount.toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={
                          sale.status === "Paid"
                            ? "badge badge-success"
                            : "badge badge-warning"
                        }
                      >
                        {sale.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Top products */}
      <section className="card table-card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Top products by stock value</h2>
            <p className="card-subtitle">
              Based on selling price × current stock
            </p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th className="text-right">Selling price</th>
                <th className="text-right">Stock</th>
                <th className="text-right">Stock value</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map(({ product, revenue }) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td className="text-right">
                    ₹{product.sellingPrice.toLocaleString()}
                  </td>
                  <td className="text-right">{product.stock}</td>
                  <td className="text-right">₹{revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
