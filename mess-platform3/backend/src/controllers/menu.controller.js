// src/controllers/menu.controller.js
const Menu = require("../models/menu.model");
const Mess = require("../models/mess.model");

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Admin: get weekly menu for their mess
exports.getAdminMenu = async (req, res) => {
  try {
    const adminId = req.user.id;

    // Find admin's mess (admin can have only one mess)
    const [messRows] = await Mess.findByAdmin(adminId);
    if (messRows.length === 0) {
      return res.json({
        success: true,
        mess: null,
        menu: null,
      });
    }

    const mess = messRows[0];

    const [rows] = await Menu.getByMess(mess.id);

    // Transform rows -> { monday: { lunch, dinner }, ... }
    const menuByDay = {};
    DAYS.forEach((day) => {
      menuByDay[day] = { lunch: "", dinner: "" };
    });

    rows.forEach((row) => {
      menuByDay[row.day_of_week] = {
        lunch: row.lunch || "",
        dinner: row.dinner || "",
      };
    });

    res.json({
      success: true,
      mess: { id: mess.id, name: mess.name },
      menu: menuByDay,
    });
  } catch (error) {
    console.error("Get Admin Menu Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin: save/replace weekly menu for their mess
// Body format:
// {
//   "menu": {
//     "monday": { "lunch": "...", "dinner": "..." },
//     "tuesday": { "lunch": "...", "dinner": "..." },
//     ...
//   }
// }
exports.saveAdminMenu = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { menu } = req.body;

    if (!menu || typeof menu !== "object") {
      return res.status(400).json({
        success: false,
        message: "menu object is required.",
      });
    }

    // Find admin's mess
    const [messRows] = await Mess.findByAdmin(adminId);
    if (messRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Create a mess first.",
      });
    }

    const messId = messRows[0].id;

    // Simple approach: delete all old rows, insert new ones
    await Menu.deleteByMess(messId);

    for (const day of DAYS) {
      const dayData = menu[day];
      if (!dayData) continue;

      const lunch = dayData.lunch || "";
      const dinner = dayData.dinner || "";

      // Skip completely empty row
      if (!lunch && !dinner) continue;

      await Menu.insertEntry(messId, day, lunch, dinner);
    }

    res.json({ success: true, message: "Menu saved successfully." });
  } catch (error) {
    console.error("Save Admin Menu Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Student: get menus for all messes they are enrolled in
exports.getStudentMenus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const [rows] = await Menu.getByStudent(studentId);

    res.json({
      success: true,
      menus: rows,
    });
  } catch (error) {
    console.error("Get Student Menus Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};