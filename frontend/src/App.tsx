import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <aside
          style={{
            width: "220px",
            background: "#111827",
            color: "#fff",
            padding: "20px",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Inventory System</h2>
          <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/">Dashboard</Link>
            <Link to="/products">Products</Link>
            <Link to="/sales">Sales</Link>
          </nav>
        </aside>

        <main style={{ flex: 1, padding: "24px", background: "#f5f5f5" }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/sales" element={<SalesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
        }
