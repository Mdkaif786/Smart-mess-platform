// src/models/attendance.model.js
const pool = require("../config/db");

// Mark attendance for a given student + mess + date
exports.markAttendance = (studentId, messId, date) => {
  return pool.query(
    "INSERT INTO attendance (student_id, mess_id, date, status) VALUES (?, ?, ?, 'present')",
    [studentId, messId, date]
  );
};

// Admin: summary count by mess for a given day
exports.getTodayCountByAdmin = (adminId, date) => {
  return pool.query(
    `
    SELECT 
      m.name AS mess_name,
      COUNT(a.id) AS present_students
    FROM messes m
    LEFT JOIN attendance a 
      ON m.id = a.mess_id AND a.date = ?
    WHERE m.admin_id = ?
    GROUP BY m.id
    `,
    [date, adminId]
  );
};

// Admin: detailed list of students present today
exports.getTodayDetailsByAdmin = (adminId, date) => {
  return pool.query(
    `
    SELECT 
      a.id AS attendance_id,
      u.id AS student_id,
      u.name AS student_name,
      u.email,
      m.name AS mess_name,
      a.date
    FROM attendance a
    JOIN users u ON a.student_id = u.id
    JOIN messes m ON a.mess_id = m.id
    WHERE m.admin_id = ? AND a.date = ?
    ORDER BY u.name ASC
    `,
    [adminId, date]
  );
};

// Student: full attendance history (for all messes)
// IMPORTANT: now includes mess_id so frontend can filter by mess
exports.getHistoryByStudent = (studentId) => {
  return pool.query(
    `
    SELECT 
      DATE(date) AS date,
      status,
      mess_id
    FROM attendance
    WHERE student_id = ?
    ORDER BY date DESC
    `,
    [studentId]
  );
};