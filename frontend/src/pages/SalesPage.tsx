// frontend/src/pages/SalesPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import api from "../api/client";

type InvoiceStatus = "Paid" | "Pending" | "Processing" | "Cancelled";

type InvoiceRow = {
  id: number;
  invoice: string;
  customer: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
};

type SalesDashboard = {
  totalRevenueToday: number;
  totalRevenueWeek: number;
  totalOrdersToday: number;
  avgOrderValue: number;
  refundRate: number;
  recentInvoices: InvoiceRow[];
  revenueTrend: { label: string; value: number }[];
};

type SalesResponse = SalesDashboard;

// ---------- Mock fallback ----------

const mockSalesData: SalesDashboard = {
  totalRevenueToday: 104400,
  totalRevenueWeek: 540000,
  totalOrdersToday: 4,
  avgOrderValue: 26100,
  refundRate: 1.4,
  revenueTrend: [
    { label: "Today", value: 104400 },
    { label: "This week", value: 540000 },
    { label: "Last week", value: 480000 },
  ],
  recentInvoices: [
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
  ],
};

const SalesPage: React.FC = () => {
  const [data, setData] = useState<SalesDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"mock" | "live">("mock");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<SalesResponse>("/api/sales-dashboard");
        setData(res.data);
        setSource("live");
      } catch (err) {
        console.warn("Sales API failed, using mock data", err);
        setData(mockSalesData);
        setSource("mock");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const d = data ?? mockSalesData;

  const maxTrendValue = useMemo(
    () => Math.max(...d.revenueTrend.map((p) => p.value)),
    [d]
  );

  return (
    <div className="bi-dashboard-root">
      <div className="bi-dashboard-shell bi-sales-shell">
        {/* Header row */}
        <header className="bi-sales-header">
          <div>
            <h1 className="bi-products-title">Inventory Management Dashboard</h1>
            <p className="bi-products-subtitle">
              Overview of products, orders, stock health and daily sales in one
              place.
            </p>
            <p className="bi-sales-source-note">
              Data source:{" "}
              {source === "mock"
                ? "Sample demo data. Once the backend is connected, this dashboard can read live metrics from the database."
                : "Live data via backend API."}
            </p>
          </div>

          <div className="bi-sales-header-right">
            <div className="bi-sales-toggle-group">
              <button className="bi-sales-toggle bi-sales-toggle-active">
                This week
              </button>
              <button className="bi-sales-toggle">This month</button>
            </div>
            <button className="bi-products-button-ghost">
              Download report
            </button>
          </div>
        </header>

        {/* Top stats row */}
        <section className="bi-sales-kpi-row">
          <div className="bi-sales-kpi-card">
            <p className="bi-products-kpi-label">Total revenue (today)</p>
            <p className="bi-sales-kpi-value">
              ₹{d.totalRevenueToday.toLocaleString()}
            </p>
            <p className="bi-products-kpi-hint">From all recorded orders</p>
          </div>
          <div className="bi-sales-kpi-card">
            <p className="bi-products-kpi-label">Orders</p>
            <p className="bi-sales-kpi-value">{d.totalOrdersToday}</p>
            <p className="bi-products-kpi-hint">Completed invoices · Stable</p>
          </div>
          <div className="bi-sales-kpi-card">
            <p className="bi-products-kpi-label">Avg. order value</p>
            <p className="bi-sales-kpi-value">
              ₹{d.avgOrderValue.toLocaleString()}
            </p>
            <p className="bi-products-kpi-hint">Across today&apos;s orders</p>
          </div>
          <div className="bi-sales-kpi-card">
            <p className="bi-products-kpi-label">Refund rate</p>
            <p className="bi-sales-kpi-value">{d.refundRate.toFixed(1)}%</p>
            <p className="bi-products-kpi-hint">Sample metric</p>
          </div>
        </section>

        {/* Revenue chart + recent invoices */}
        <section className="bi-sales-main-grid">
          {/* Revenue overview */}
          <div className="bi-dashboard-card bi-sales-revenue-card">
            <header className="bi-dashboard-card-header">
              <p className="bi-dashboard-card-title">Revenue overview</p>
              <div className="bi-sales-toggle-group">
                <button className="bi-sales-toggle bi-sales-toggle-active">
                  Today
                </button>
                <button className="bi-sales-toggle">This week</button>
                <button className="bi-sales-toggle">This month</button>
              </div>
            </header>

            <div className="bi-sales-revenue-chart">
              {d.revenueTrend.map((p) => (
                <div key={p.label} className="bi-sales-revenue-bar-wrapper">
                  <div
                    className="bi-sales-revenue-bar"
                    style={{
                      height: `${40 + (p.value / maxTrendValue) * 80}px`,
                    }}
                  />
                  <span className="bi-sales-revenue-label">{p.label}</span>
                </div>
              ))}
            </div>

            <div className="bi-sales-revenue-summary">
              <div>
                <p className="bi-dashboard-muted">Today</p>
                <p className="bi-sales-summary-value">
                  ₹{d.totalRevenueToday.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="bi-dashboard-muted">This week (est.)</p>
                <p className="bi-sales-summary-value">
                  ₹{d.totalRevenueWeek.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="bi-dashboard-muted">Refund rate</p>
                <p className="bi-sales-summary-value">
                  {d.refundRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Recent invoices */}
          <div className="bi-dashboard-card bi-sales-invoices-card">
            <header className="bi-dashboard-card-header">
              <p className="bi-dashboard-card-title">Recent invoices</p>
              <button className="bi-products-button-ghost-small">
                View all
              </button>
            </header>
            <p className="bi-dashboard-muted bi-sales-invoices-subtitle">
              Latest recorded sales.
            </p>

            <div className="bi-dashboard-table-wrapper">
              <table className="bi-dashboard-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {d.recentInvoices.map((row) => (
                    <tr key={row.id}>
                      <td>{row.invoice}</td>
                      <td>{row.customer}</td>
                      <td>{row.date}</td>
                      <td>₹{row.amount.toLocaleString()}</td>
                      <td>
                        <span
                          className={`bi-sales-status-pill bi-sales-status-${row.status.toLowerCase()}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {loading && (
          <div className="bi-dashboard-loading-overlay">
            <span>Loading sales metrics…</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPage;
