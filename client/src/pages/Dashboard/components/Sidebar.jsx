import {
    FaHome,
    FaClipboardList,
    FaWallet,
    FaMoneyCheckAlt,
    FaCog,
    FaSignOutAlt,
    FaChevronLeft,
    FaChevronRight,
    FaGift
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({ collapsed, onToggle }) {

    const menu = [

        {
            name: "Dashboard",
            icon: <FaHome />,
            path: "/dashboard"
        },

        {
            name: "Surveys",
            icon: <FaClipboardList />,
            path: "/dashboard/surveys"
        },

        {
            name: "Bonus",
            icon: <FaGift />,
            path: "/dashboard/bonus"
        },

        {
            name: "Wallet",
            icon: <FaWallet />,
            path: "/dashboard/wallet"
        },

        {
            name: "Withdraw",
            icon: <FaMoneyCheckAlt />,
            path: "/dashboard/withdraw"
        },

        {
            name: "Settings",
            icon: <FaCog />,
            path: "/dashboard/settings"
        }

    ];

    return (

        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

            <div className="sidebar-header">

                <div className="sidebar-logo">

                    <h2>
                        Survey<span>Pool</span>
                    </h2>

                </div>

                <button
                    className="collapse-btn"
                    onClick={onToggle}
                    aria-label={collapsed ? "Expand" : "Collapse"}
                    type="button"
                >
                    {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
                </button>

            </div>

            <nav>

                {menu.map((item) => (

                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === "/dashboard"}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >

                        {item.icon}

                        <span>{item.name}</span>

                    </NavLink>

                ))}

            </nav>

            <button className="logout-btn" type="button">

                <FaSignOutAlt />

                <span>Logout</span>

            </button>

        </aside>

    );

}