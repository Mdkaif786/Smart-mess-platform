const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");
const {
  createNotice,
  getNotices,
  getStudentNotices,
  deleteNotice,
} = require("../controllers/notice.controller");

// Admin
router.post("/create", verifyToken, createNotice);
router.get("/my", verifyToken, getNotices);
router.delete("/delete/:id", verifyToken, deleteNotice);

// Student
router.get("/student", verifyToken, getStudentNotices);

module.exports = router;
