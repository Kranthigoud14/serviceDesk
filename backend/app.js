const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const assetRoutes = require("./routes/assetRoutes");
const technicianRoutes = require("./routes/technicianRoutes");
const workforceRoutes = require("./routes/workforceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const auditRoutes = require("./routes/auditRoutes");
const knowledgeRoutes = require("./routes/knowledgeRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/workforce", workforceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/knowledge-base", knowledgeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "ServiceDesk Pro API is running"
    });
});

module.exports = app;