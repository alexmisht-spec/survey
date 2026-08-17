import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/Topbar";
import MobileBottomNav from "./components/MobileBottomNav";
import "./DashboardLayout.css";

export default function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div
            className={`dashboard-layout ${
                collapsed ? "sidebar-collapsed" : ""
            }`}
        >
            <Sidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed((prev) => !prev)}
            />

            <div className="dashboard-main">

                <TopBar />

                <main className="dashboard-content">
                    <Outlet />
                </main>

            </div>

            <MobileBottomNav />

        </div>
    );
}