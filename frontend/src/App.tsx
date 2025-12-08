import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";

/**
 * Top layout for all authenticated pages (dashboard, products, sales)
 * Login page.
 */
const AppLayout: React.FC = () => {
  const navigate = useNavigate();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "app-nav-link app-nav-link-active" : "app-nav-link";

  const handleLogout = () => {
    // real auth
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          <div className="app-logo-dot" />
          <div className="app-brand-title">Business Inventory</div>
        </div>

        <div className="app-header-right">
          <nav className="app-nav">
            <NavLink to="/dashboard" className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/products" className={navClass}>
              Products
            </NavLink>
            <NavLink to="/sales" className={navClass}>
              Sales
            </NavLink>
          </nav>

          <button className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        {/* Authenticated pages will render here */}
        <Outlet />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login routes (no layout) */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Auth layout routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/sales" element={<SalesPage />} />
        </Route>

        {/* Fallback: unknown path → Login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
