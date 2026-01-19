// src/controllers/mess.controller.js
const Mess = require("../models/mess.model");
const pool = require("../config/db");

// Admin creates mess
exports.createMess = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, description, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: "Name and location are required.",
      });
    }

    // One mess per admin
    const [existing] = await Mess.findByAdmin(adminId);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You already created a mess.",
      });
    }

    await Mess.create(name, description, location, adminId);

    res.json({
      success: true,
      message:
        "Mess created successfully. It is now pending approval by the super admin.",
    });
  } catch (error) {
    console.error("Create Mess Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Admin gets own mess (including status)
exports.getMyMess = async (req, res) => {
  try {
    const adminId = req.user.id;

    const [rows] = await Mess.findByAdmin(adminId);

    res.json({
      success: true,
      mess: rows[0] || null,
    });
  } catch (error) {
    console.error("Get My Mess Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Admin deletes mess
exports.deleteMess = async (req, res) => {
  try {
    const { id } = req.params;

    await Mess.deleteById(id);

    res.json({
      success: true,
      message: "Mess deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Mess Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Public / student – get all APPROVED messes
exports.getAllMesses = async (req, res) => {
  try {
    const [messes] = await Mess.getAll();

    res.json({
      success: true,
      messes,
    });
  } catch (error) {
    console.error("Get All Messes Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Admin updates mess basic info
exports.updateMess = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { id } = req.params;
    const { name, description, location } = req.body;

    // Ensure this mess belongs to the admin
    const [mess] = await pool.query(
      "SELECT id FROM messes WHERE id = ? AND admin_id = ?",
      [id, adminId]
    );

    if (mess.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this mess",
      });
    }

    await pool.query(
      `
      UPDATE messes
      SET name = ?, description = ?, location = ?
      WHERE id = ?
      `,
      [name, description, location, id]
    );

    res.json({ success: true, message: "Mess updated successfully" });
  } catch (error) {
    console.error("Update Mess Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========== SUPER ADMIN FUNCTIONS ==========

// Get all pending messes with admin info
exports.getPendingMesses = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only super admin can view pending messes.",
      });
    }

    const [rows] = await Mess.getPendingWithAdmin();

    res.json({
      success: true,
      messes: rows,
    });
  } catch (error) {
    console.error("Get Pending Messes Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Approve a mess (super admin)
exports.approveMess = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only super admin can approve messes.",
      });
    }

    const { mess_id } = req.body;

    if (!mess_id) {
      return res.status(400).json({
        success: false,
        message: "mess_id is required.",
      });
    }

    await Mess.updateStatus(mess_id, "approved");

    res.json({
      success: true,
      message: "Mess approved successfully.",
    });
  } catch (error) {
    console.error("Approve Mess Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Reject a mess (super admin)
exports.rejectMess = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only super admin can reject messes.",
      });
    }

    const { mess_id } = req.body;

    if (!mess_id) {
      return res.status(400).json({
        success: false,
        message: "mess_id is required.",
      });
    }

    await Mess.updateStatus(mess_id, "rejected");

    res.json({
      success: true,
      message: "Mess rejected.",
    });
  } catch (error) {
    console.error("Reject Mess Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// Get ALL messes (any status) with admin info - super admin only
exports.getAllMessesAdmin = async (req, res) => {
  try {
    if (req.user.role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Only super admin can view all messes.",
      });
    }

    const [rows] = await Mess.getAllWithAdmin();

    res.json({
      success: true,
      messes: rows,
    });
  } catch (error) {
    console.error("Get All Messes (Admin) Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};