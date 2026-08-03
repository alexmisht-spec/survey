import { Routes, Route } from "react-router-dom";


import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NotFound from "../pages/NotFound";

import CompleteProfile from "../pages/Auth/CompleteProfile";
import ProtectedRoute from "./ProtectedRoute";

import UploadVerification from "../pages/Verification/UploadVerification";
import VerificationPending from "../pages/Verification/VerificationPending";

import TakeSurvey from "../pages/surveys/Surveys";
import SurveySuccess from "../pages/surveys/SurveySuccess";

import AdminRoute from "../pages/Admin/routes/AdminRoute";
import AdminLayout from "../pages/Admin/layouts/AdminLayout";
import Users from "../pages/Admin/Users";
import Surveys from "../pages/Admin/AdminSurveys";
import Withdrawals from "../pages/Admin/Withdrawal";
import Reports from "../pages/Admin/Reports";
import Settings from "../pages/Admin/Settings";
import AdminDashboard from "../pages/Admin/AdminDashboard";


import Dashboard from "../pages/Dashboard/Dashboard";
import Wallet from "../pages/Dashboard/Wallet";
import Withdraw from "../pages/Dashboard/Withdraw";
import SettingsPage from "../pages/Dashboard/Settings";
import DashboardSurveys from "../pages/Dashboard/Surveys";
import DashboardLayout from "../pages/Dashboard/dashboardLayout";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import LandingPage from "../pages/Landing/Landing";
import AdminRewardCredentials from "../pages/Admin/AdminRewards";
import Bonus from "../pages/Dashboard/bonus/Bonus";
import EveryLogin from "../pages/Dashboard/bonus/EveryLogin";
import Redirecting from "../pages/Dashboard/Redirecting";
import BonusStatus from "../pages/Dashboard/bonus/BonusStatus";

export default function AppRoutes() {

    return (

        <Routes>

            {/* ================= PUBLIC ================= */}

            <Route path="/" element={<LandingPage/>} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />
            <Route
    path="/forgot-password"
    element={<ForgotPassword />}
/>

            <Route
            path="/reset-password"
             element={<ResetPassword />}
                />

            <Route
                path="/verification-pending"
                element={<VerificationPending />}
            />

            <Route
                path="/survey-success"
                element={<SurveySuccess />}
            />
 

            {/* ================= PROTECTED ================= */}

      <Route element={<ProtectedRoute />}>

    <Route
        path="/complete-profile"
        element={<CompleteProfile />}
    />

    <Route
        path="/upload-verification"
        element={<UploadVerification />}
    />

    <Route
        path="/every-login"
        element={<EveryLogin />}
    />

    <Route
        path="/bonus-status"
        element={<BonusStatus />}
    />

    <Route
        path="/surveys/:id"
        element={<TakeSurvey />}
    />

    <Route
        path="/dashboard"
        element={<DashboardLayout />}
    >
        <Route
            index
            element={<Dashboard />}
        />

        <Route
            path="surveys"
            element={<DashboardSurveys />}
        />

        <Route
            path="wallet"
            element={<Wallet />}
        />

        <Route
            path="withdraw"
            element={<Withdraw />}
        />

        <Route
            path="bonus"
            element={<Bonus />}
        />

        <Route
            path="settings"
            element={<SettingsPage />}
        />
    </Route>

</Route>
            <Route
    path="/every-login"
    element={<EveryLogin />}
/>

<Route
    path="/redirecting"
    element={<Redirecting />}
/>



            {/* ================= ADMIN ================= */}

            <Route element={<AdminRoute />}>

                <Route element={<AdminLayout />}>

                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/users"
                        element={<Users />}
                    />

                    <Route
                        path="/admin/surveys"
                        element={<Surveys />}
                    />

                    <Route
                        path="/admin/withdrawals"
                        element={<Withdrawals />}
                    />

                    <Route
                        path="/admin/reports"
                        element={<Reports />}
                    />

                    <Route
                        path="/admin/settings"
                        element={<Settings />}
                    />
                     <Route
                  path="/admin/reward-credentials"
                    element={<AdminRewardCredentials />}
                    />

                </Route>
               

            </Route>

            {/* ================= 404 ================= */}

            <Route
                path="*"
                element={<NotFound />}
            />

        </Routes>

    );

}