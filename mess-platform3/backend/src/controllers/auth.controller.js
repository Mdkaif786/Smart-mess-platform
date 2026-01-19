// src/controllers/auth.controller.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// REGISTER CONTROLLER (v3 – with extra fields & security question)
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      aadharNumber,
      gstNumber,
      securityQuestion,
      securityAnswer,
    } = req.body;

    // Basic required fields
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !securityQuestion ||
      !securityAnswer
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Determine final role (only allow student or mess_admin from frontend)
    let finalRole = role === "mess_admin" ? "mess_admin" : "student";

    // Extra required fields by role
    if (finalRole === "student" && !aadharNumber) {
      return res.status(400).json({
        success: false,
        message: "Aadhar number is required for students.",
      });
    }

    if (finalRole === "mess_admin" && !gstNumber) {
      return res.status(400).json({
        success: false,
        message: "GST number is required for mess admins.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hash security answer as well
    const securityAnswerHash = await bcrypt.hash(securityAnswer, 10);

    // Prepare role-specific fields
    const aadhar_value = finalRole === "student" ? aadharNumber : null;
    const gst_value = finalRole === "mess_admin" ? gstNumber : null;

    // Create user
    await User.create({
      name,
      email,
      password_hash: hashedPassword,
      role: finalRole,
      phone,
      address,
      aadhar_number: aadhar_value,
      gst_number: gst_value,
      security_question: securityQuestion,
      security_answer_hash: securityAnswerHash,
    });

    res.json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// LOGIN CONTROLLER – localStorage + Authorization header (no cookies)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const users = await User.findByEmail(email);
    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = users[0];

    const isValidPassword = await bcrypt.compare(
      password,
      user.password_hash
    );
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return token in JSON – frontend will store in localStorage and send in Authorization header
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// LOGOUT CONTROLLER (optional – does nothing special in localStorage version)
exports.logout = (req, res) => {
  // For localStorage-based auth, backend doesn't need to clear anything.
  // Frontend will clear localStorage and redirect.
  res.json({
    success: true,
    message: "Logged out successfully.",
  });
};

// CHANGE PASSWORD (logged-in user)
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT in verifyToken
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    // Find user by id
    const users = await User.findById(userId);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = users[0];

    // Verify current password
    const isValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update in DB
    await User.updatePassword(userId, newHash);

    res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change Password Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// FORGOT PASSWORD STEP 1 – get security question
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const users = await User.findByEmail(email);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    const user = users[0];

    res.json({
      success: true,
      securityQuestion: user.security_question,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// FORGOT PASSWORD STEP 2 – answer question and set new password
exports.resetPasswordWithAnswer = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;

    if (!email || !securityAnswer || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Email, security answer and new password are required.",
      });
    }

    const users = await User.findByEmail(email);
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email.",
      });
    }

    const user = users[0];

    // Compare provided answer with stored hash
    const isAnswerValid = await bcrypt.compare(
      securityAnswer,
      user.security_answer_hash
    );

    if (!isAnswerValid) {
      return res.status(400).json({
        success: false,
        message: "Security answer is incorrect.",
      });
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    await User.updatePassword(user.id, newHash);

    res.json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};