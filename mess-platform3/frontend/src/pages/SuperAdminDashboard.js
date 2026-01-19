// src/pages/SuperAdminDashboard.js
import { useEffect, useState } from "react";
import axios from "axios";

import SuperAdminLayout from "../components/layout/SuperAdminLayout";
import PendingMessList from "../components/superadmin/PendingMessList";
import AllMessesTable from "../components/superadmin/AllMessesTable";
import MessDetailModal from "../components/superadmin/MessDetailModal";

function SuperAdminDashboard() {
  const token = localStorage.getItem("token");

  const [pendingMesses, setPendingMesses] = useState([]);
  const [allMesses, setAllMesses] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedMess, setSelectedMess] = useState(null);

  const fetchPendingMesses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/mess/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingMesses(res.data.messes || []);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error loading pending messes."
      );
    }
  };

  const fetchAllMesses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/mess/all-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllMesses(res.data.messes || []);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error loading all messes."
      );
    }
  };

  const reloadData = async () => {
    await Promise.all([fetchPendingMesses(), fetchAllMesses()]);
  };

  const approveMess = async (messId) => {
    if (!window.confirm("Approve this mess?")) return;

    try {
      await axios.post(
        "http://localhost:5000/mess/approve",
        { mess_id: messId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      reloadData();
    } catch (err) {
      alert(err.response?.data?.message || "Error approving mess.");
    }
  };

  const rejectMess = async (messId) => {
    if (!window.confirm("Reject this mess?")) return;

    try {
      await axios.post(
        "http://localhost:5000/mess/reject",
        { mess_id: messId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      reloadData();
    } catch (err) {
      alert(err.response?.data?.message || "Error rejecting mess.");
    }
  };

  useEffect(() => {
    reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SuperAdminLayout>
      <h1 className="text-4xl font-extrabold mb-4">
        Super Admin – Mess Management
      </h1>
      <p className="text-gray-600 mb-8">
        Review new mess requests and manage all messes and their admins.
      </p>

      {message && (
        <p className="mb-4 text-red-600 font-semibold">
          {message}
        </p>
      )}

      {/* Section 1: Pending approvals */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          Pending Mess Approvals
        </h2>
        <PendingMessList
          pendingMesses={pendingMesses}
          onApprove={approveMess}
          onReject={rejectMess}
        />
      </section>

      {/* Section 2: All messes */}
      <section>
        <h2 className="text-2xl font-bold mb-4">All Messes</h2>
        <AllMessesTable
          allMesses={allMesses}
          onApprove={approveMess}
          onReject={rejectMess}
          onViewDetails={setSelectedMess}
        />
      </section>

      {/* Detail modal */}
      <MessDetailModal
        mess={selectedMess}
        onClose={() => setSelectedMess(null)}
      />
    </SuperAdminLayout>
  );
}

export default SuperAdminDashboard;