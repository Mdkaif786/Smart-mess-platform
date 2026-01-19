// src/models/user.model.js
const pool = require("../config/db");

// Find user by email
exports.findByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows;
};

// Create new user with extended fields
exports.create = async ({
  name,
  email,
  password_hash,
  role,
  phone,
  address,
  aadhar_number,
  gst_number,
  security_question,
  security_answer_hash,
}) => {
  return pool.query(
    `
    INSERT INTO users
      (name, email, password_hash, role,
       phone, address, aadhar_number, gst_number,
       security_question, security_answer_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      name,
      email,
      password_hash,
      role,
      phone,
      address,
      aadhar_number,
      gst_number,
      security_question,
      security_answer_hash,
    ]
  );
};

// NEW: find user by ID
exports.findById = async (id) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );
  return rows;
};

// NEW: update only the password
exports.updatePassword = async (id, newPasswordHash) => {
  return pool.query(
    "UPDATE users SET password_hash = ? WHERE id = ?",
    [newPasswordHash, id]
  );
};