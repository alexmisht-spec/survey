import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export default function AdminRoute() {

    const { user, loading } = useAuth();

    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (!user) {

        return <Navigate to="/login" replace />;

    }

    if (user.role !== "ADMIN") {

        return <Navigate to="/dashboard" replace />;

    }

    return <Outlet />;

}