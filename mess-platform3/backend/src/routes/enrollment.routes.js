const express = require("express");
const router = express.Router();
const {
    requestJoinMess,
    getPendingRequests,
    approveRequest,
    rejectRequest,
    getEnrollmentStatus,
    getEnrolledStudents,
    getMyEnrollments,
    removeStudent,   // << ADD THIS
  } = require("../controllers/enrollment.controller");
  
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/request", verifyToken, requestJoinMess);
router.get("/pending", verifyToken, getPendingRequests);
router.post("/approve", verifyToken, approveRequest);
router.post("/reject", verifyToken, rejectRequest);
router.get("/status", verifyToken, getEnrollmentStatus);
router.delete("/remove/:id", verifyToken, removeStudent);
router.get("/my", verifyToken, getMyEnrollments);

// NEW: admin – get all approved students enrolled in their mess
router.get("/enrolled", verifyToken, getEnrolledStudents);

module.exports = router;
