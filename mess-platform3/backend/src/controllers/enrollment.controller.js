const Enrollment = require("../models/enrollment.model");

// Student request join
exports.requestJoinMess = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { mess_id } = req.body;

    if (!mess_id) {
      return res.status(400).json({
        success: false,
        message: "mess_id is required.",
      });
    }

    const [existing] = await Enrollment.findExistingRequest(studentId, mess_id);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Already requested or already approved.",
      });
    }

    await Enrollment.createRequest(studentId, mess_id);

    res.json({ success: true, message: "Join request sent successfully." });
  } catch (error) {
    console.error("Join Request Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin pending requests
exports.getPendingRequests = async (req, res) => {
  try {
    const adminId = req.user.id;
    const [rows] = await Enrollment.getPendingByAdmin(adminId);

    res.json({ success: true, requests: rows });
  } catch (error) {
    console.error("Pending Requests Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Approve
exports.approveRequest = async (req, res) => {
  try {
    const { enrollment_id } = req.body;

    await Enrollment.approve(enrollment_id);

    res.json({ success: true, message: "Request approved successfully." });
  } catch (error) {
    console.error("Approve Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Reject
exports.rejectRequest = async (req, res) => {
  try {
    const { enrollment_id } = req.body;

    await Enrollment.reject(enrollment_id);

    res.json({ success: true, message: "Request rejected successfully." });
  } catch (error) {
    console.error("Reject Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Student status
exports.getEnrollmentStatus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const [rows] = await Enrollment.getCurrentByStudent(studentId);

    if (rows.length === 0) {
      return res.json({ success: true, status: "not_joined" });
    }

    res.json({
      success: true,
      status: rows[0].status,
      mess_id: rows[0].mess_id,
      mess_name: rows[0].mess_name,
    });
  } catch (error) {
    console.error("Status Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin enrolled students
exports.getEnrolledStudents = async (req, res) => {
  try {
    const adminId = req.user.id;
    const [rows] = await Enrollment.getApprovedByAdmin(adminId);

    res.json({ success: true, students: rows, total: rows.length });
  } catch (error) {
    console.error("Enrolled Students Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove student
exports.removeStudent = async (req, res) => {
  try {
    const enrollmentId = req.params.id;

    const [info] = await Enrollment.getEnrollmentInfo(enrollmentId);
    if (info.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    await Enrollment.deleteAttendance(info[0].student_id, info[0].mess_id);
    await Enrollment.deleteEnrollment(enrollmentId);

    res.json({ success: true, message: "Student removed successfully" });
  } catch (error) {
    console.error("Remove Student Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Student enrollments
exports.getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;
    const [rows] = await Enrollment.getAllByStudent(studentId);

    res.json({ success: true, enrollments: rows });
  } catch (error) {
    console.error("My Enrollments Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
