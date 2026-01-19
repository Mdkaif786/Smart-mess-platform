// src/models/menu.model.js
const pool = require("../config/db");

// Get weekly menu for one mess
exports.getByMess = (messId) => {
  return pool.query(
    `
    SELECT day_of_week, lunch, dinner
    FROM mess_menus
    WHERE mess_id = ?
    ORDER BY FIELD(
      day_of_week,
      'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
    )
    `,
    [messId]
  );
};

// Delete all menu entries for one mess (used before replacing)
exports.deleteByMess = (messId) => {
  return pool.query(
    "DELETE FROM mess_menus WHERE mess_id = ?",
    [messId]
  );
};

// Insert one menu row
exports.insertEntry = (messId, dayOfWeek, lunch, dinner) => {
  return pool.query(
    `
    INSERT INTO mess_menus (mess_id, day_of_week, lunch, dinner)
    VALUES (?, ?, ?, ?)
    `,
    [messId, dayOfWeek, lunch, dinner]
  );
};

// Get menus for all messes in which a student is enrolled
exports.getByStudent = (studentId) => {
  return pool.query(
    `
    SELECT
      mm.mess_id,
      m.name AS mess_name,
      mm.day_of_week,
      mm.lunch,
      mm.dinner
    FROM mess_menus mm
    JOIN messes m ON mm.mess_id = m.id
    JOIN student_mess_enrollments e ON e.mess_id = mm.mess_id
    WHERE e.student_id = ?
      AND e.status = 'approved'
      AND e.is_current = TRUE
    ORDER BY
      m.name,
      FIELD(
        mm.day_of_week,
        'monday','tuesday','wednesday','thursday','friday','saturday','sunday'
      )
    `,
    [studentId]
  );
};