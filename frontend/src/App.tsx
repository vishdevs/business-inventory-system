import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-topbar">
          <div className="app-logo">
            <div className="app-logo-icon">⬢</div>
            <span>Inventory Management</span>
          </div>

          <nav className="app-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                "app-nav-link" + (isActive ? " app-nav-link-active" : "")
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                "app-nav-link" + (isActive ? " app-nav-link-active" : "")
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/sales"
              className={({ isActive }) =>
                "app-nav-link" + (isActive ? " app-nav-link-active" : "")
              }
            >
              Sales
            </NavLink>
          </nav>
        </header>

        <main className="app-page">
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
