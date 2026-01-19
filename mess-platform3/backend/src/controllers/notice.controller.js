const Notice = require("../models/notice.model");

// Admin creates notice
exports.createNotice = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required.",
      });
    }

    const [mess] = await Notice.getMessByAdmin(adminId);
    if (mess.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Create a mess first.",
      });
    }

    await Notice.create(mess[0].id, title, message);

    res.json({ success: true, message: "Notice added successfully." });

  } catch (error) {
    console.error("Create Notice Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Admin gets own notices
exports.getNotices = async (req, res) => {
  try {
    const adminId = req.user.id;

    const [mess] = await Notice.getMessByAdmin(adminId);
    if (mess.length === 0) {
      return res.json({ success: true, notices: [] });
    }

    const [rows] = await Notice.getByMess(mess[0].id);

    res.json({ success: true, notices: rows });

  } catch (error) {
    console.error("Get Notices Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Admin deletes notice
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    await Notice.deleteById(id);

    res.json({ success: true, message: "Notice removed successfully." });

  } catch (error) {
    console.error("Delete Notice Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Student views notices
exports.getStudentNotices = async (req, res) => {
  try {
    const studentId = req.user.id;

    const [rows] = await Notice.getStudentNoticesWithMess(studentId);

    res.json({
      success: true,
      notices: rows,
    });

  } catch (error) {
    console.error("Student Notice Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
