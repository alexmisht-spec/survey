import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import router from "./routes/test.routes.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import verificationRoutes from "./routes/verification.routes.js";

import adminRoutes from "./routes/admin.routes.js";
import surveyRoutes from "./routes/survey.routes.js";

import adminSurveyRoutes from "./routes/adminSurvey.routes.js";
import adminQuestionRoutes from "./routes/adminQuestion.routes.js";
import adminWithdrawalRoutes from "./routes/adminWithdrawal.routes.js";
import adminDashboardRoutes from "./routes/adminDashboard.routes.js";
import adminVerificationRoutes from "./routes/admin.verification.routes.js";
import adminAssignmentRoutes from "./routes/adminAssignment.routes.js";
import adminRewardRoutes from "./routes/adminReward.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import settingsRoutes from "./routes/settings.route.js";
import forgotPasswordRoutes from "./routes/forgotPassword.route.js";
import darajaRoutes from "./routes/daraja.routes.js";
import withdrawalRoutes from "./routes/withdrawal.routes.js";
import rewardAdminRoutes from "./routes/rewardAdmin.routes.js";
import rewardRoutes from "./routes/reward.route.js";
import adminEmailRoutes from "./routes/adminEmail.routes.js";

const app = express();

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/
const allowedOrigins =[
    "http://localhost:5173",
    "https://surveypool.co.ke",
    "https://www.surveypool.co.ke",
];


app.use(cors({
    origin(origin, callback) {
        // Allow server-to-server requests (no Origin header)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Static Uploads
|--------------------------------------------------------------------------
*/

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        application: "Survey Platform API",
        version: "1.0.0",
        status: "Running",
    });
});

/*
|--------------------------------------------------------------------------
| Test Route
|--------------------------------------------------------------------------
*/

app.use("/api/test", router);

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/daraja", darajaRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/reward", rewardRoutes);
app.use(
    "/api/admin/email",
    adminEmailRoutes
);
/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

app.use("/api/admin", adminRoutes);

// Survey Management
app.use("/api/admin/surveys", adminSurveyRoutes);
app.use("/api/admin/surveys", adminQuestionRoutes);

// Survey Assignment
app.use("/api/admin", adminAssignmentRoutes);

// Verification
app.use("/api/admin/verification", adminVerificationRoutes);

// Withdrawals
app.use("/api/admin/withdrawals", adminWithdrawalRoutes);

// Dashboard
app.use("/api/admin/dashboard", adminDashboardRoutes);

/*
|--------------------------------------------------------------------------
| Placeholder Routes
|--------------------------------------------------------------------------
*/

app.use("/api/users", (req, res) => {
    res.json({
        message: "User Routes Coming Soon",
    });
});

app.use("/api/withdrawals", (req, res) => {
    res.json({
        message: "Withdrawal Routes Coming Soon",
    });
});
app.use(
    "/api/admin/rewards",
    adminRewardRoutes
);
app.use(
    "/api/notifications",
    notificationRoutes
);
app.use("/api/settings", settingsRoutes);
app.use("/api/auth/forgot-password", forgotPasswordRoutes);
app.use("/api/admin/rewards", rewardAdminRoutes);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;