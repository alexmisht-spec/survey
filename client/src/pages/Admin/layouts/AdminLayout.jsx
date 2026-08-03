import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import "../admin.css";

export default function AdminLayout() {

    return (

        <div className="admin-layout">

            <AdminSidebar />

            <div className="admin-main">

                <AdminNavbar />

                <div className="admin-content">

                    <Outlet />

                </div>

            </div>

        </div>

    );

}