const pool = require("../config/db");

// Get mess id by admin
exports.getMessByAdmin = (adminId) => {
  return pool.query(
    "SELECT id FROM messes WHERE admin_id = ?",
    [adminId]
  );
};

// Create notice
exports.create = (messId, title, message) => {
  return pool.query(
    "INSERT INTO notices (mess_id, title, message) VALUES (?, ?, ?)",
    [messId, title, message]
  );
};

// ✅ ADD THIS FUNCTION (THIS FIXES THE ERROR)
exports.getByMess = (messId) => {
  return pool.query(
    `
    SELECT 
      n.id,
      n.title,
      n.message,
      n.created_at,
      m.id AS mess_id,
      m.name AS mess_name
    FROM notices n
    JOIN messes m ON n.mess_id = m.id
    WHERE n.mess_id = ?
    ORDER BY n.created_at DESC
    `,
    [messId]
  );
};

// Get all notices for a student with mess info (already good)
exports.getStudentNoticesWithMess = (studentId) => {
  return pool.query(
    `
    SELECT
      n.id,
      n.title,
      n.message,
      n.created_at,
      m.id AS mess_id,
      m.name AS mess_name
    FROM notices n
    JOIN messes m ON n.mess_id = m.id
    JOIN student_mess_enrollments e ON e.mess_id = m.id
    WHERE e.student_id = ?
      AND e.status = 'approved'
    ORDER BY n.created_at DESC
    `,
    [studentId]
  );
};

// Delete notice
exports.deleteById = (id) => {
  return pool.query(
    "DELETE FROM notices WHERE id = ?",
    [id]
  );
};

// Get student's current mess (kept for backward compatibility)
exports.getStudentMess = (studentId) => {
  return pool.query(
    "SELECT mess_id FROM student_mess_enrollments WHERE student_id = ? AND is_current = TRUE",
    [studentId]
  );
};
