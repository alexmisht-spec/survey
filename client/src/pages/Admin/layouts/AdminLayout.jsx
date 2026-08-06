import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../admin.css";
import "./AdminLayout.css"

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <AdminSidebar />
      <div className={`overlay ${sidebarOpen ? "active" : ""}`} onClick={() => setSidebarOpen(false)} />
      
      <div className="admin-main">
        <AdminNavbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}