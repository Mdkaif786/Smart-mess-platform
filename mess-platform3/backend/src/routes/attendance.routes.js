const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getTodayAttendanceCount,
  getAttendanceHistory,
  getTodayAttendanceDetails, // 👈 NEW
} = require("../controllers/attendance.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Student
router.post("/mark", verifyToken, markAttendance);

// Admin - summary (already existing)
router.get("/today", verifyToken, getTodayAttendanceCount);

// Admin - detailed list of present students 👇
router.get("/today/details", verifyToken, getTodayAttendanceDetails);

//attendance history
router.get("/history", verifyToken, getAttendanceHistory);


module.exports = router;
