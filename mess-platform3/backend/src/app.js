// src/app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const pool = require("./config/db");

// Middlewares
app.use(cors());
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
  res.send("Mess Platform Backend Running ");
});

// Test DB Route
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS value");
    res.json({ success: true, rows });
  } catch (err) {
    console.error("DB Test Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auth routes
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// Mess Routes
const messRoutes = require("./routes/mess.routes");
app.use("/mess", messRoutes);

// Enrollment routes
const enrollmentRoutes = require("./routes/enrollment.routes");
app.use("/enrollment", enrollmentRoutes);

// Attendance routes
const attendanceRoutes = require("./routes/attendance.routes");
app.use("/attendance", attendanceRoutes);

// Notice routes
const noticeRoutes = require("./routes/notice.routes");
app.use("/notice", noticeRoutes);

// Menu routes
const menuRoutes = require("./routes/menu.routes");
app.use("/menu", menuRoutes);

module.exports = app;