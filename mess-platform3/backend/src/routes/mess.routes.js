// src/routes/mess.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const {
  createMess,
  getMyMess,
  deleteMess,
  updateMess,
  getAllMesses,
  getPendingMesses,
  approveMess,
  rejectMess,
  getAllMessesAdmin,
} = require("../controllers/mess.controller");

// Admin actions
router.post("/create", verifyToken, createMess);
router.get("/my", verifyToken, getMyMess);
router.put("/update/:id", verifyToken, updateMess);
router.delete("/delete/:id", verifyToken, deleteMess);

// Public / student – get all APPROVED messes
router.get("/all", getAllMesses);

// Super admin – mess approval flow
router.get("/pending", verifyToken, getPendingMesses);
router.post("/approve", verifyToken, approveMess);
router.post("/reject", verifyToken, rejectMess);

// Super admin – view ALL messes with admin details
router.get("/all-admin", verifyToken, getAllMessesAdmin);

module.exports = router;