// src/models/mess.model.js
const pool = require("../config/db");

// Find messes created by a specific admin
exports.findByAdmin = (adminId) => {
  return pool.query(
    "SELECT * FROM messes WHERE admin_id = ?",
    [adminId]
  );
};

// Create a new mess for an admin
// status will default to 'pending' from DB
exports.create = (name, description, location, adminId) => {
  return pool.query(
    "INSERT INTO messes (name, description, location, admin_id) VALUES (?, ?, ?, ?)",
    [name, description, location, adminId]
  );
};

exports.deleteById = (id) => {
  return pool.query(
    "DELETE FROM messes WHERE id = ?",
    [id]
  );
};

// Public / student: only approved messes
exports.getAll = () => {
  return pool.query(
    `
    SELECT id, name, description, location
    FROM messes
    WHERE status = 'approved'
    `
  );
};

// Super admin: get all pending messes plus admin info
exports.getPendingWithAdmin = () => {
  return pool.query(
    `
    SELECT
      m.id,
      m.name,
      m.description,
      m.location,
      m.status,
      u.id AS admin_id,
      u.name AS admin_name,
      u.email AS admin_email,
      u.phone AS admin_phone,
      u.address AS admin_address,
      u.gst_number AS admin_gst_number
    FROM messes m
    JOIN users u ON m.admin_id = u.id
    WHERE m.status = 'pending'
    ORDER BY m.created_at DESC
    `
  );
};

// Update status of a mess (pending / approved / rejected)
exports.updateStatus = (messId, status) => {
  return pool.query(
    "UPDATE messes SET status = ? WHERE id = ?",
    [status, messId]
  );
};
// Super admin: get ALL messes with admin info (any status)
exports.getAllWithAdmin = () => {
  return pool.query(
    `
    SELECT
      m.id,
      m.name,
      m.description,
      m.location,
      m.status,
      m.created_at,
      u.id AS admin_id,
      u.name AS admin_name,
      u.email AS admin_email,
      u.phone AS admin_phone,
      u.address AS admin_address,
      u.gst_number AS admin_gst_number
    FROM messes m
    JOIN users u ON m.admin_id = u.id
    ORDER BY m.created_at DESC
    `
  );
};