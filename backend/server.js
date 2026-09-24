require("dotenv").config();

const http = require("http");

const app = require("./app");
const connectDB = require("./config/db");

const {
    initializeSocket
} = require("./socket");

const {
    startSlaNotificationService
} = require("./services/slaNotificationService");

const PORT = process.env.PORT || 5000;

// ==========================================
// CONNECT DATABASE
// ==========================================

connectDB();

// ==========================================
// CREATE HTTP SERVER
// ==========================================

const server = http.createServer(app);

// ==========================================
// INITIALIZE SOCKET.IO
// ==========================================

initializeSocket(server);

// ==========================================
// START SLA NOTIFICATION SERVICE
// ==========================================

startSlaNotificationService();

// ==========================================
// START SERVER
// ==========================================

server.listen(PORT, () => {

    console.log(
        `ServiceDesk Pro API running on port ${PORT}`
    );

});