const pool = require("../config/db");

// Check existing request
exports.findExistingRequest = (studentId, messId) => {
  return pool.query(
    `SELECT * FROM student_mess_enrollments
     WHERE student_id = ? AND mess_id = ?
     AND status IN ('pending', 'approved')`,
    [studentId, messId]
  );
};

// Create join request
exports.createRequest = (studentId, messId) => {
  return pool.query(
    `INSERT INTO student_mess_enrollments
     (student_id, mess_id, status, is_current)
     VALUES (?, ?, 'pending', FALSE)`,
    [studentId, messId]
  );
};

// Pending requests for admin
exports.getPendingByAdmin = (adminId) => {
  return pool.query(
    `
    SELECT 
      e.id,
      u.name AS student_name,
      u.email,
      m.name AS mess_name
    FROM student_mess_enrollments e
    JOIN users u ON e.student_id = u.id
    JOIN messes m ON e.mess_id = m.id
    WHERE m.admin_id = ?
      AND e.status = 'pending'
      AND u.role = 'student'
    `,
    [adminId]
  );
};

// Approve request
exports.approve = (enrollmentId) => {
  return pool.query(
    `UPDATE student_mess_enrollments
     SET status = 'approved', is_current = TRUE
     WHERE id = ?`,
    [enrollmentId]
  );
};

// Reject request
exports.reject = (enrollmentId) => {
  return pool.query(
    `UPDATE student_mess_enrollments
     SET status = 'rejected'
     WHERE id = ?`,
    [enrollmentId]
  );
};

// Student current enrollment
exports.getCurrentByStudent = (studentId) => {
  return pool.query(
    `
    SELECT e.status, e.mess_id, m.name AS mess_name
    FROM student_mess_enrollments e
    JOIN messes m ON e.mess_id = m.id
    WHERE e.student_id = ?
      AND e.is_current = TRUE
    LIMIT 1
    `,
    [studentId]
  );
};

// Admin enrolled students
exports.getApprovedByAdmin = (adminId) => {
  return pool.query(
    `
    SELECT 
      e.id AS enrollment_id,
      u.id AS student_id,
      u.name AS student_name,
      u.email,
      m.name AS mess_name
    FROM student_mess_enrollments e
    JOIN users u ON e.student_id = u.id
    JOIN messes m ON e.mess_id = m.id
    WHERE m.admin_id = ?
      AND e.status = 'approved'
      AND e.is_current = TRUE
    ORDER BY m.name, u.name
    `,
    [adminId]
  );
};

// Remove student helper
exports.getEnrollmentInfo = (enrollmentId) => {
  return pool.query(
    `SELECT student_id, mess_id
     FROM student_mess_enrollments
     WHERE id = ?`,
    [enrollmentId]
  );
};

exports.deleteAttendance = (studentId, messId) => {
  return pool.query(
    `DELETE FROM attendance
     WHERE student_id = ? AND mess_id = ?`,
    [studentId, messId]
  );
};

exports.deleteEnrollment = (enrollmentId) => {
  return pool.query(
    `DELETE FROM student_mess_enrollments
     WHERE id = ?`,
    [enrollmentId]
  );
};

// Student all enrollments
exports.getAllByStudent = (studentId) => {
  return pool.query(
    `SELECT mess_id, status
     FROM student_mess_enrollments
     WHERE student_id = ?`,
    [studentId]
  );
};
