import { NavLink } from "react-router-dom";
import {
  FaChartPie, FaUsers, FaClipboardList, FaMoneyBillWave,
  FaChartBar, FaCog, FaGift, FaSignOutAlt,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import "./AdminSidebar.css"

export default function AdminSidebar() {
  const { logout } = useAuth();

  const navItems = [
    { to: "/admin/dashboard", icon: <FaChartPie />, label: "Dashboard" },
    { to: "/admin/users", icon: <FaUsers />, label: "Users" },
    { to: "/admin/surveys", icon: <FaClipboardList />, label: "Surveys" },
    { to: "/admin/withdrawals", icon: <FaMoneyBillWave />, label: "Withdrawals" },
    { to: "/admin/reward-credentials", icon: <FaGift />, label: "Reward Credentials" },
    { to: "/admin/reports", icon: <FaChartBar />, label: "Reports" },
    { to: "/admin/settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <aside className="admin-sidebar">
      <h2 className="logo">Survey Admin</h2>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={logout}>
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </aside>
  );
}