// src/pages/AdminDashboard.js
import { useEffect, useState } from "react";
import axios from "axios";

import AdminLayout from "../components/layout/AdminLayout";
import DashboardHome from "../components/admin/DashboardHome";
import ManageMess from "../components/admin/ManageMess";
import ManageNotices from "./ManageNotices";
import EnrolledStudents from "./EnrolledStudents";
import MessMenu from "../components/admin/MessMenu";
import ChangePasswordForm from "../components/auth/ChangePasswordForm";
import GlassBox from "../components/ui/GlassBox";

function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [activeSection, setActiveSection] = useState("dashboard");
  const [myMess, setMyMess] = useState(null);

  const [pending, setPending] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [presentStudents, setPresentStudents] = useState([]);
  const [todayMenu, setTodayMenu] = useState(null);

  /* ================= API ================= */

  const fetchMyMess = async () => {
    try {
      const res = await axios.get("http://localhost:5000/mess/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyMess(res.data.mess);
    } catch (err) {
      console.error("Fetch my mess error:", err);
    }
  };

  const fetchPending = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/enrollment/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPending(res.data.requests || []);
    } catch (err) {
      console.error("Fetch pending enrollments error:", err);
    }
  };

  const fetchEnrolled = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/enrollment/enrolled",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEnrolledStudents(res.data.students || []);
    } catch (err) {
      console.error("Fetch enrolled students error:", err);
    }
  };

  const fetchPresent = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/attendance/today/details",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPresentStudents(res.data.students || []);
    } catch (err) {
      console.error("Fetch present students error:", err);
    }
  };

  const fetchTodayMenu = async () => {
    try {
      const res = await axios.get("http://localhost:5000/menu/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const menu = res.data.menu;
      if (!menu) {
        setTodayMenu(null);
        return;
      }

      const todayDay = new Date()
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase(); // monday, tuesday, ...

      const dayMenu = menu[todayDay] || null;
      setTodayMenu(dayMenu);
    } catch (err) {
      console.error("Error fetching today's menu", err);
    }
  };

  const createMess = async (data) => {
    try {
      await axios.post("http://localhost:5000/mess/create", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(
        "Mess created successfully. It is now pending approval by the super admin."
      );
      await fetchMyMess();
      setActiveSection("dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating mess.");
    }
  };

  const updateMess = async (data) => {
    try {
      await axios.put(
        `http://localhost:5000/mess/update/${myMess.id}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyMess({ ...myMess, ...data });
      setActiveSection("dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error updating mess.");
    }
  };

  const deleteMess = async () => {
    if (!window.confirm("Delete this mess?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/mess/delete/${myMess.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMyMess(null);
      setActiveSection("dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting mess.");
    }
  };

  const approveRequest = async (enrollment_id) => {
    try {
      await axios.post(
        "http://localhost:5000/enrollment/approve",
        { enrollment_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPending();
      fetchPresent();
    } catch (err) {
      alert(
        err.response?.data?.message || "Error approving request."
      );
    }
  };

  const removeStudent = async (enrollmentId) => {
    if (!window.confirm("Remove this student from mess?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/enrollment/remove/${enrollmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchEnrolled();
    } catch (err) {
      alert(
        err.response?.data?.message || "Error removing student."
      );
    }
  };

  const rejectRequest = async (enrollment_id) => {
    try {
      await axios.post(
        "http://localhost:5000/enrollment/reject",
        { enrollment_id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchPending();
    } catch (err) {
      alert(
        err.response?.data?.message || "Error rejecting request."
      );
    }
  };

  useEffect(() => {
    fetchMyMess();
    fetchPending();
    fetchEnrolled();
    fetchPresent();
    fetchTodayMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMessApproved =
    myMess && myMess.status && myMess.status === "approved";

  const renderApprovalWarning = () => {
    const status = myMess?.status || "pending";

    let title = "Mess not approved yet";
    let body =
      "Your mess is pending approval by the super admin. You can only view status and edit mess details for now.";
    if (status === "rejected") {
      title = "Mess request rejected";
      body =
        "Your mess request has been rejected by the super admin. Please contact the platform owner or update the mess details and request again.";
    }

    return (
      <GlassBox>
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700">{body}</p>
      </GlassBox>
    );
  };

  return (
    <AdminLayout onNavigate={setActiveSection}>
      {activeSection === "dashboard" && (
        <DashboardHome
          myMess={myMess}
          isMessApproved={isMessApproved}
          enrolledCount={enrolledStudents.length}
          presentCount={presentStudents.length}
          pendingCount={pending.length}
          enrolledStudents={enrolledStudents}
          presentStudents={presentStudents}
          pendingRequests={pending}
          onApprove={approveRequest}
          onReject={rejectRequest}
          onRemoveStudent={removeStudent}
          todayMenu={todayMenu}
        />
      )}

      {activeSection === "manageMess" && (
        <ManageMess
          mess={myMess}
          mode={myMess ? "edit" : "create"}
          onCreate={createMess}
          onUpdate={updateMess}
          onDelete={deleteMess}
          onCancel={() => setActiveSection("dashboard")}
        />
      )}

      {activeSection === "manageNotices" &&
        (isMessApproved ? (
          <ManageNotices />
        ) : (
          renderApprovalWarning()
        ))}

      {activeSection === "enrolledStudents" &&
        (isMessApproved ? (
          <EnrolledStudents />
        ) : (
          renderApprovalWarning()
        ))}

      {activeSection === "menu" &&
        (isMessApproved ? (
          <MessMenu />
        ) : (
          renderApprovalWarning()
        ))}

      {activeSection === "settings" && <ChangePasswordForm />}
    </AdminLayout>
  );
}

export default AdminDashboard;