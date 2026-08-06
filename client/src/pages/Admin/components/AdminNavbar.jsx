// AdminNavbar.jsx
import useAuth from "../../../hooks/useAuth";
import "./AdminNavbar.css"

export default function AdminNavbar({ onMenuToggle }) {
  const { user } = useAuth();

  return (
    <header className="admin-navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h1>Survey Platform Admin</h1>
      </div>

      <div className="navbar-user">
        <div className="user-avatar">
          {user?.firstName?.charAt(0).toUpperCase() || "U"}
        </div>
        <span className="user-greeting">
          Welcome, <strong>{user?.firstName || "Admin"}</strong>
        </span>
      </div>
    </header>
  );
}