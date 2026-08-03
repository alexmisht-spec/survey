import { NavLink } from "react-router-dom";

import {
    FaChartPie,
    FaUsers,
    FaClipboardList,
    FaMoneyBillWave,
    FaChartBar,
    FaCog,
    FaGift,
    FaSignOutAlt,
} from "react-icons/fa";

import useAuth from "../../../hooks/useAuth";

export default function AdminSidebar() {

    const { logout } = useAuth();

    return (

        <aside className="admin-sidebar">

            <h2 className="logo">

                Survey Admin

            </h2>

            <NavLink to="/admin/dashboard">

                <FaChartPie />

                Dashboard

            </NavLink>

            <NavLink to="/admin/users">

                <FaUsers />

                Users

            </NavLink>

            <NavLink to="/admin/surveys">

                <FaClipboardList />

                Surveys

            </NavLink>

            <NavLink to="/admin/withdrawals">

                <FaMoneyBillWave />

                Withdrawals

            </NavLink>

            <NavLink to="/admin/reward-credentials">

                <FaGift />

                Reward Credentials

            </NavLink>

            <NavLink to="/admin/reports">

                <FaChartBar />

                Reports

            </NavLink>

            <NavLink to="/admin/settings">

                <FaCog />

                Settings

            </NavLink>

            <button
                className="logout-btn"
                onClick={logout}
            >

                <FaSignOutAlt />

                Logout

            </button>

        </aside>

    );

}