import {
    FaHome,
    FaClipboardList,
    FaWallet,
    FaMoneyCheckAlt,
    FaGift,
    FaUsers,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import "./MobileBottomNav.css";

export default function MobileBottomNav() {

    const links = [

        {
            name: "Dashboard",
            icon: <FaHome />,
            path: "/dashboard",
        },

        {
            name: "Surveys",
            icon: <FaClipboardList />,
            path: "/dashboard/surveys",
        },

        {
            name: "Bonus",
            icon: <FaGift />,
            path: "/dashboard/bonus",
        },

        {
            name: "Referrals",
            icon: <FaUsers />,
            path: "/dashboard/referrals",
        },

        {
            name: "Wallet",
            icon: <FaWallet />,
            path: "/dashboard/wallet",
        },

        {
            name: "Withdraw",
            icon: <FaMoneyCheckAlt />,
            path: "/dashboard/withdraw",
        },

    ];

    return (

        <nav className="mobile-bottom-nav">

            {links.map((item) => (

                <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/dashboard"}
                    className={({ isActive }) =>
                        isActive
                            ? "mobile-link active"
                            : "mobile-link"
                    }
                >

                    {item.icon}

                    <span>{item.name}</span>

                </NavLink>

            ))}

        </nav>

    );

}