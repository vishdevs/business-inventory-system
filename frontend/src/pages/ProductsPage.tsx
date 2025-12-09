// frontend/src/pages/ProductsPage.tsx

import React, { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { mockProducts, Product } from "../mock/inventory";

type ProductRow = Product;

type ProductsResponse = {
  products: ProductRow[];
};

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductRow[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"mock" | "live">("mock");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get<ProductsResponse>("/api/products");
        setProducts(res.data.products);
        setSource("live");
      } catch (err) {
        console.warn("Products API failed, using mock data", err);
        setProducts(mockProducts);
        setSource("mock");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock <= 5).length,
    [products]
  );

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }, [products, search]);

  return (
    <div className="bi-dashboard-root">
      <div className="bi-dashboard-shell bi-products-shell">
        {/* Header + stats row */}
        <header className="bi-products-header">
          <div>
            <h1 className="bi-products-title">Product inventory</h1>
            <p className="bi-products-subtitle">
              Search, review and manage items available in the store.
            </p>
          </div>

          <div className="bi-products-header-right">
            <button className="bi-products-button-ghost">Open sales</button>
            <button className="bi-products-button-primary">+ Add product</button>
          </div>
        </header>

        <section className="bi-products-kpi-row">
          <div className="bi-products-kpi-card">
            <p className="bi-products-kpi-label">Total products</p>
            <p className="bi-products-kpi-value">{products.length}</p>
            <p className="bi-products-kpi-hint">Items in catalog</p>
          </div>
          <div className="bi-products-kpi-card">
            <p className="bi-products-kpi-label">Low stock</p>
            <p className="bi-products-kpi-value">{lowStockCount}</p>
            <p className="bi-products-kpi-hint">Stock ≤ 5 units</p>
          </div>
          <div className="bi-products-kpi-card">
            <p className="bi-products-kpi-label">Search status</p>
            <p className="bi-products-kpi-value">{filteredProducts.length}</p>
            <p className="bi-products-kpi-hint">Matching current filter</p>
          </div>
        </section>

        {/* Search + table */}
        <section className="bi-products-table-card">
          <div className="bi-products-table-header">
            <div className="bi-products-tag">
              {products.length} products · {lowStockCount} low stock
            </div>

            <div className="bi-products-search-wrapper">
              <input
                className="bi-products-search-input"
                placeholder="Search by name or category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="bi-dashboard-table-wrapper bi-products-table-wrapper">
            <table className="bi-dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Buying price</th>
                  <th>Selling price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.name}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₹{p.buyingPrice.toLocaleString()}</td>
                    <td>₹{p.sellingPrice.toLocaleString()}</td>
                    <td className={p.stock <= 5 ? "bi-products-low" : ""}>
                      {p.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="bi-products-empty">
                No products match the current search.
              </div>
            )}
          </div>

          <p className="bi-products-footer-note">
            {source === "mock"
              ? "This page is currently using sample mock data. Once the backend is connected, this table will display live products from the database."
              : "Data is loaded from the live database through the backend API."}
          </p>
        </section>

        {loading && (
          <div className="bi-dashboard-loading-overlay">
            <span>Loading products…</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
