// src/pages/StudentDashboard.js
import { useEffect, useState } from "react";
import axios from "axios";

import StudentLayout from "../components/layout/StudentLayout";
import StudentHome from "../components/student/StudentHome";
import ExploreMesses from "../components/student/ExploreMesses";
import AttendanceCalendar from "../components/student/AttendanceCalendar";
import StudentNotices from "./StudentNotices";
import StudentMessMenu from "../components/student/StudentMessMenu";
import ChangePasswordForm from "../components/auth/ChangePasswordForm";

function StudentDashboard() {
  const studentName = localStorage.getItem("name") || "Student";
  const token = localStorage.getItem("token");

  const [activeSection, setActiveSection] = useState("dashboard");

  // Enrollments: [{ mess_id, status }, ...]
  const [enrollments, setEnrollments] = useState([]);
  const [requestStatusMap, setRequestStatusMap] = useState({});

  // Attendance history (all messes)
  const [history, setHistory] = useState([]);

  // All messes (public)
  const [messes, setMesses] = useState([]);

  // Menus for messes the student is enrolled in
  const [studentMenus, setStudentMenus] = useState([]);

  /* ================= API CALLS ================= */

  // Public: all approved messes
  const fetchMesses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/mess/all");
      setMesses(res.data.messes || []);
    } catch (err) {
      console.error("Fetch messes error:", err);
    }
  };

  // Enrollments for this student (requires auth)
  const fetchEnrollments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/enrollment/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data.enrollments || [];
      setEnrollments(list);

      const map = {};
      list.forEach((e) => {
        map[e.mess_id] = e.status;
      });
      setRequestStatusMap(map);
    } catch (err) {
      console.error("Fetch enrollments error:", err);
    }
  };

  // Attendance history for this student (all messes)
  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/attendance/history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const historyData = res.data.history || [];
      setHistory(historyData);
    } catch (err) {
      console.error("Fetch attendance history error:", err);
    }
  };

  // Menus for all messes this student is enrolled in
  const fetchStudentMenus = async () => {
    try {
      const res = await axios.get("http://localhost:5000/menu/student", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentMenus(res.data.menus || []);
    } catch (err) {
      console.error("Fetch student menus error:", err);
    }
  };

  // Mark attendance for a specific mess
  const markAttendance = async (messId) => {
    try {
      await axios.post(
        "http://localhost:5000/attendance/mark",
        { mess_id: messId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Attendance marked successfully");
      fetchHistory();
    } catch (err) {
      alert(
        err.response?.data?.message || "Error while marking attendance"
      );
    }
  };

  // Request to join a specific mess
  const requestJoin = async (messId) => {
    try {
      await axios.post(
        "http://localhost:5000/enrollment/request",
        { mess_id: messId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Request sent");
      fetchEnrollments();
    } catch (err) {
      alert(
        err.response?.data?.message || "Error while sending join request"
      );
    }
  };

  /* ================= DERIVED DATA ================= */

  const todayDay = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase(); // monday, tuesday, ...

  // Map: messId -> { lunch, dinner } for today
  const todayMenusByMess = {};
  studentMenus.forEach((row) => {
    if (row.day_of_week === todayDay) {
      todayMenusByMess[row.mess_id] = {
        lunch: row.lunch,
        dinner: row.dinner,
      };
    }
  });

  // Approved messes with name + today's menu
  const approvedMesses = enrollments
    .filter((e) => e.status === "approved")
    .map((e) => {
      const mess = messes.find((m) => m.id === e.mess_id);
      const todayMenu = todayMenusByMess[e.mess_id] || null;

      return {
        id: e.mess_id,
        name: mess ? mess.name : `Mess #${e.mess_id}`,
        todayMenu,
      };
    });

  /* ================= INIT ================= */

  useEffect(() => {
    fetchMesses();
    fetchEnrollments();
    fetchHistory();
    fetchStudentMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= RENDER ================= */

  return (
    <StudentLayout onNavigate={setActiveSection}>
      {activeSection === "dashboard" && (
        <StudentHome
          studentName={studentName}
          approvedMesses={approvedMesses}
          onMarkAttendance={markAttendance}
        />
      )}

      {activeSection === "explore" && (
        <ExploreMesses
          messes={messes}
          onRequestJoin={requestJoin}
          requestStatusMap={requestStatusMap}
        />
      )}

      {activeSection === "attendance" && (
        <AttendanceCalendar history={history} messes={approvedMesses} />
      )}

      {activeSection === "notices" && <StudentNotices />}

      {activeSection === "menu" && <StudentMessMenu menus={studentMenus} />}

      {activeSection === "settings" && <ChangePasswordForm />}
    </StudentLayout>
  );
}

export default StudentDashboard;