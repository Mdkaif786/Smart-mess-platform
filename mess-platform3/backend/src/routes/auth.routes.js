// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// REGISTER
router.post("/register", authController.register);

// LOGIN
router.post("/login", authController.login);

// CHANGE PASSWORD (requires login)
router.put(
  "/change-password",
  verifyToken,
  authController.changePassword
);

// FORGOT PASSWORD – STEP 1: get security question
router.post("/forgot-password", authController.forgotPassword);

// FORGOT PASSWORD – STEP 2: answer question and reset password
router.post(
  "/reset-password-with-answer",
  authController.resetPasswordWithAnswer
);

// LOGOUT
router.post("/logout", authController.logout);

module.exports = router;