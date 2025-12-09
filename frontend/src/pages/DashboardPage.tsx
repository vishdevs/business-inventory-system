// frontend/src/pages/DashboardPage.tsx

import React, { useEffect, useState } from "react";
import api from "../api/client";

type StockLevelRow = {
  product: string;
  sku: string;
  onHand: number;
  available: number;
  value: number;
};

type RecentOrderRow = {
  orderId: string;
  date: string;
  status: string;
  amount: number;
};

type DashboardData = {
  userName: string;
  stockAvailability: number; // e.g. 97.5
  itemsInStock: number;
  reorderAlerts: number;
  inventorySeries: { label: string; value: number }[];
  stockLevels: StockLevelRow[];
  revenue: number;
  totalOrders: number;
  pendingOrders: number;
  ordersByDay: { label: string; value: number }[];
  recentOrders: RecentOrderRow[];
};

// ---------- MOCK DATA (fallback if backend fails) ----------

const mockDashboardData: DashboardData = {
  userName: "Admin",
  stockAvailability: 97.5,
  itemsInStock: 3528,
  reorderAlerts: 12,
  inventorySeries: [
    { label: "Day 1", value: 200 },
    { label: "Day 2", value: 220 },
    { label: "Day 3", value: 235 },
    { label: "Day 4", value: 250 },
    { label: "Day 5", value: 270 },
    { label: "Day 6", value: 290 },
    { label: "Day 7", value: 310 },
  ],
  stockLevels: [
    {
      product: "Wireless Mouse",
      sku: "WM123",
      onHand: 120,
      available: 115,
      value: 2875,
    },
    {
      product: "Office Chair",
      sku: "OC456",
      onHand: 78,
      available: 78,
      value: 23400,
    },
    {
      product: "Desk Lamp",
      sku: "DL789",
      onHand: 245,
      available: 245,
      value: 7350,
    },
    {
      product: "Filing Cabinet",
      sku: "FC101",
      onHand: 50,
      available: 50,
      value: 12500,
    },
    {
      product: "Monitor Stand",
      sku: "MS112",
      onHand: 200,
      available: 200,
      value: 10000,
    },
  ],
  revenue: 58942,
  totalOrders: 1092,
  pendingOrders: 26,
  ordersByDay: [
    { label: "M", value: 4 },
    { label: "T", value: 7 },
    { label: "W", value: 5 },
    { label: "T", value: 9 },
    { label: "F", value: 6 },
    { label: "S", value: 3 },
    { label: "S", value: 4 },
  ],
  recentOrders: [
    {
      orderId: "#1063",
      date: "04/22/2024",
      status: "Shipped",
      amount: 1250,
    },
    {
      orderId: "#1062",
      date: "04/21/2024",
      status: "Processing",
      amount: 824,
    },
    {
      orderId: "#1061",
      date: "04/20/2024",
      status: "Shipped",
      amount: 2170,
    },
    {
      orderId: "#1060",
      date: "04/19/2024",
      status: "Cancelled",
      amount: 149,
    },
    {
      orderId: "#1059",
      date: "04/18/2024",
      status: "Shipped",
      amount: 459,
    },
  ],
};

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // If your backend has a route like GET /api/dashboard
        // it should return the same shape as DashboardData.
        const response = await api.get<DashboardData>("/api/dashboard");
        setData(response.data);
      } catch (err) {
        console.warn("Dashboard API failed, using mock data", err);
        setData(mockDashboardData);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const d = data ?? mockDashboardData;

  return (
    <div className="bi-dashboard-root">
      <div className="bi-dashboard-shell">
        {/* Top bar inside the card (Welcome + right side chart) */}
        <div className="bi-dashboard-top">
          <div className="bi-dashboard-top-left">
            <h1 className="bi-dashboard-title">
              Welcome back, {d.userName}!
            </h1>
            <div className="bi-dashboard-kpi-row">
              <div className="bi-dashboard-kpi-card">
                <p className="bi-dashboard-kpi-label">Stock Availability</p>
                <p className="bi-dashboard-kpi-value">
                  {d.stockAvailability.toFixed(1)}%
                </p>
              </div>
              <div className="bi-dashboard-kpi-card">
                <p className="bi-dashboard-kpi-label">Items in Stock</p>
                <p className="bi-dashboard-kpi-value">
                  {d.itemsInStock.toLocaleString()}
                </p>
              </div>
              <div className="bi-dashboard-kpi-card">
                <p className="bi-dashboard-kpi-label">Reorder Alerts</p>
                <p className="bi-dashboard-kpi-value">
                  {d.reorderAlerts.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - mini line chart for inventory value */}
          <div className="bi-dashboard-inventory-card">
            <div className="bi-dashboard-card-header">
              <p className="bi-dashboard-card-title">Inventory Value</p>
              <span className="bi-dashboard-card-subtitle">
                Last {d.inventorySeries.length} days
              </span>
            </div>
            <div className="bi-dashboard-line-chart">
              {d.inventorySeries.map((point, idx) => (
                <div
                  key={point.label}
                  className="bi-dashboard-line-chart-bar"
                  style={{
                    height: `${40 + point.value / 10}px`,
                    opacity:
                      idx === d.inventorySeries.length - 1 ? 1 : 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom grid: stock table + orders summary + recent orders table */}
        <div className="bi-dashboard-bottom-grid">
          {/* Stock levels table */}
          <section className="bi-dashboard-card bi-dashboard-stock-card">
            <header className="bi-dashboard-card-header">
              <p className="bi-dashboard-card-title">Stock Levels</p>
            </header>
            <div className="bi-dashboard-table-wrapper">
              <table className="bi-dashboard-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>On hand</th>
                    <th>Available</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {d.stockLevels.map((row) => (
                    <tr key={row.sku}>
                      <td>{row.product}</td>
                      <td>{row.sku}</td>
                      <td>{row.onHand}</td>
                      <td>{row.available}</td>
                      <td>
                        $
                        {row.value.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Right column: recent orders summary + small bar chart + recent orders table */}
          <div className="bi-dashboard-right-col">
            {/* Recent orders summary */}
            <section className="bi-dashboard-card bi-dashboard-orders-summary">
              <header className="bi-dashboard-card-header">
                <p className="bi-dashboard-card-title">Recent Orders</p>
              </header>
              <div className="bi-dashboard-orders-stats">
                <div>
                  <p className="bi-dashboard-muted">Revenue</p>
                  <p className="bi-dashboard-big-number">
                    ₹{d.revenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="bi-dashboard-muted">Orders</p>
                  <p className="bi-dashboard-big-number">
                    {d.totalOrders.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="bi-dashboard-muted">Pending</p>
                  <p className="bi-dashboard-big-number">
                    {d.pendingOrders.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bi-dashboard-mini-bar-chart">
                {d.ordersByDay.map((day) => (
                  <div
                    key={day.label}
                    className="bi-dashboard-mini-bar-wrapper"
                  >
                    <div
                      className="bi-dashboard-mini-bar"
                      style={{ height: `${30 + day.value * 6}px` }}
                    />
                    <span className="bi-dashboard-mini-bar-label">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent orders table */}
            <section className="bi-dashboard-card bi-dashboard-recent-orders">
              <header className="bi-dashboard-card-header">
                <p className="bi-dashboard-card-title">Recent orders</p>
              </header>
              <div className="bi-dashboard-table-wrapper">
                <table className="bi-dashboard-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.recentOrders.map((row) => (
                      <tr key={row.orderId}>
                        <td>{row.orderId}</td>
                        <td>{row.date}</td>
                        <td>{row.status}</td>
                        <td>
                          ₹
                          {row.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        {loading && (
          <div className="bi-dashboard-loading-overlay">
            <span>Loading live data…</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
