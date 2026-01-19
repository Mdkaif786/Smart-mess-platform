const Attendance = require("../models/attendance.model");

// Student marks attendance
exports.markAttendance = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { mess_id } = req.body;

    if (!mess_id) {
      return res.status(400).json({
        success: false,
        message: "mess_id is required.",
      });
    }

    const today = new Date().toISOString().split("T")[0];

    await Attendance.markAttendance(studentId, mess_id, today);

    res.json({
      success: true,
      message: "Attendance marked successfully.",
    });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked today.",
      });
    }

    console.error("Attendance Mark Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Admin summary
exports.getTodayAttendanceCount = async (req, res) => {
  try {
    const adminId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const [result] = await Attendance.getTodayCountByAdmin(adminId, today);

    res.json({ success: true, attendance: result });

  } catch (error) {
    console.error("Attendance Count Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin detailed list
exports.getTodayAttendanceDetails = async (req, res) => {
  try {
    const adminId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    const [rows] = await Attendance.getTodayDetailsByAdmin(adminId, today);

    res.json({
      success: true,
      students: rows,
      count: rows.length,
    });

  } catch (error) {
    console.error("Attendance Details Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Student history
exports.getAttendanceHistory = async (req, res) => {
  try {
    const studentId = req.user.id;

    const [rows] = await Attendance.getHistoryByStudent(studentId);

    res.json({ success: true, history: rows });

  } catch (error) {
    console.error("Attendance History Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
