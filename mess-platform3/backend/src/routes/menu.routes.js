// src/routes/menu.routes.js
const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth.middleware");
const {
  getAdminMenu,
  saveAdminMenu,
  getStudentMenus,
} = require("../controllers/menu.controller");

// Admin – get & save own mess menu
router.get("/my", verifyToken, getAdminMenu);
router.post("/my", verifyToken, saveAdminMenu);

// Student – view menus of enrolled messes
router.get("/student", verifyToken, getStudentMenus);

module.exports = router;