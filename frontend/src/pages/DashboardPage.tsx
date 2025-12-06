export default function DashboardPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Snapshot of total products, low stock items and recent revenue.
        </p>
      </div>

      <div className="alert-bar">
        Backend not connected. Displaying sample data. To connect the backend,
        ensure the Spring Boot server is running on port 8080.
      </div>

      <div className="stat-grid">
        <div className="card">
          <div className="card-label">Total Products</div>
          <div className="card-value">20</div>
        </div>
        <div className="card">
          <div className="card-label">Low Stock Items</div>
          <div className="card-value">3</div>
        </div>
        <div className="card">
          <div className="card-label">Revenue (Last 30 Days)</div>
          <div className="card-value">$6899.49</div>
        </div>
      </div>
    </div>
  );
}
