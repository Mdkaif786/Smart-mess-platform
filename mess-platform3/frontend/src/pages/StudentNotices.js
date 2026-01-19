// src/pages/StudentNotices.js
import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const token = localStorage.getItem("token");

  const fetchNotices = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/notice/student",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotices(res.data.notices || []);
    } catch (err) {
      console.log("Notice fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PDF Download
  const downloadPDF = (notice) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(notice.mess_name, 14, 20);

    doc.setFontSize(14);
    doc.text(notice.title, 14, 35);

    doc.setFontSize(11);
    doc.text(
      `Date: ${new Date(notice.created_at).toLocaleString()}`,
      14,
      45
    );

    doc.setFontSize(12);
    doc.text(notice.message, 14, 60, { maxWidth: 180 });

    doc.save(`${notice.title}.pdf`);
  };

  return (
    <div className="relative min-h-screen animated-light px-6 py-12 overflow-hidden text-gray-900">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-52 h-52 bg-pink-300 rounded-full blur-[90px] opacity-60 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-300 rounded-full blur-[110px] opacity-60 animate-ping"></div>

      {/* Header */}
      <div className="glass-box p-10 rounded-3xl shadow-2xl text-center max-w-4xl mx-auto backdrop-blur-xl border border-white/50 mb-14">
        <h1 className="text-4xl font-extrabold mb-4">Mess Notices</h1>
        <p className="text-lg opacity-90">
          Important updates from your enrolled messes
        </p>
      </div>

      {/* Notices */}
      {notices.length === 0 ? (
        <div className="glass-box p-8 rounded-2xl text-center max-w-xl mx-auto border border-white/40">
          No notices available.
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notices.map((n) => (
            <div
              key={n.id}
              className="glass-box p-6 rounded-2xl shadow-xl border border-white/40 hover:scale-105 transition-transform"
            >
              <span className="inline-block mb-3 px-4 py-1 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                {n.mess_name}
              </span>

              <h2 className="text-xl font-bold mb-2">{n.title}</h2>

              <p className="text-gray-700 opacity-90 line-clamp-3">
                {n.message}
              </p>

              <p className="text-sm text-gray-500 mt-2 mb-4">
                {new Date(n.created_at).toLocaleString()}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedNotice(n)}
                  className="flex-1 px-4 py-2 text-sm rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition"
                >
                  View Full
                </button>

                <button
                  onClick={() => downloadPDF(n)}
                  className="flex-1 px-4 py-2 text-sm rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:scale-105 transition"
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="glass-box p-8 rounded-2xl max-w-xl w-full border border-white/40 relative">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-3 right-4 text-xl font-bold"
            >
              ✕
            </button>

            <p className="text-sm font-semibold text-blue-600 mb-2">
              {selectedNotice.mess_name}
            </p>

            <h2 className="text-2xl font-bold mb-4">
              {selectedNotice.title}
            </h2>

            <p className="text-gray-700 mb-4">
              {selectedNotice.message}
            </p>

            <p className="text-sm text-gray-500">
              {new Date(selectedNotice.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentNotices;