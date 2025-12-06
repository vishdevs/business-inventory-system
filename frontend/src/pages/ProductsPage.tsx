import { mockProducts } from "../mock/inventory";

export default function ProductsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <p className="page-subtitle">
          View and manage all inventory items with pricing and stock status.
        </p>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-title">Product Inventory</div>

          <div className="section-actions">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search products..."
              />
            </div>
            <button className="primary-button">
              <span>＋</span> Add Product
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Buying Price</th>
              <th>Selling Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((p) => {
              const isLow = p.stockQuantity <= 5;
              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹{p.buyingPrice.toLocaleString()}</td>
                  <td>₹{p.sellingPrice.toLocaleString()}</td>
                  <td className={isLow ? "stock-low" : ""}>{p.stockQuantity}</td>
                  <td>
                    <span className="badge-status">Active</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-button">✏️</button>
                      <button className="icon-button">🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
