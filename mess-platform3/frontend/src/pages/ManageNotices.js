// src/pages/ManageNotices.js
import { useState, useEffect } from "react";
import axios from "axios";

import NoticeForm from "../components/notices/NoticeForm";
import NoticeList from "../components/notices/NoticeList";

function ManageNotices() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchNotices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/notice/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(res.data.notices || []);
    } catch (err) {
      console.error("Fetch notices error:", err);
    }
  };

  const createNotice = async () => {
    if (!title || !message) return alert("Fill all fields");

    try {
      await axios.post(
        "http://localhost:5000/notice/create",
        { title, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTitle("");
      setMessage("");
      fetchNotices();
    } catch (err) {
      alert(
        err.response?.data?.message || "Error creating notice."
      );
    }
  };

  const deleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/notice/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchNotices();
    } catch (err) {
      alert(
        err.response?.data?.message || "Error deleting notice."
      );
    }
  };

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen animated-light px-6 py-12">
      {/* Page Container */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-wide">
            Manage Notices
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage notices visible to enrolled students
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* LEFT: Create Notice */}
          <div className="lg:col-span-1">
            <NoticeForm
              title={title}
              message={message}
              setTitle={setTitle}
              setMessage={setMessage}
              onSubmit={createNotice}
            />
          </div>

          {/* RIGHT: Notices List */}
          <div className="lg:col-span-2">
            <div className="glass-box p-6 rounded-2xl">
              <h2 className="text-2xl font-bold mb-6">
                Published Notices
              </h2>

              <NoticeList notices={notices} onDelete={deleteNotice} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageNotices;