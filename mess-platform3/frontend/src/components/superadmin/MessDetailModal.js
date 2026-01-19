// src/components/superadmin/MessDetailModal.js
import React from "react";

function MessDetailModal({ mess, onClose }) {
  if (!mess) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      {/* Solid white card instead of glass, so it stands out */}
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold mb-4">
          Mess & Admin Details
        </h3>

        {/* Mess info */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">
            Mess Information
          </h4>
          <p className="text-sm">
            <span className="font-semibold">Name:</span>{" "}
            {mess.name}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Location:</span>{" "}
            {mess.location}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Status:</span>{" "}
            {mess.status}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Description:</span>{" "}
            {mess.description || "No description"}
          </p>
        </div>

        {/* Admin info */}
        <div>
          <h4 className="text-lg font-semibold mb-2">
            Admin Information
          </h4>
          <p className="text-sm">
            <span className="font-semibold">Name:</span>{" "}
            {mess.admin_name}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Email:</span>{" "}
            {mess.admin_email}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Phone:</span>{" "}
            {mess.admin_phone}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Address:</span>{" "}
            {mess.admin_address || "Not provided"}
          </p>
          <p className="text-sm">
            <span className="font-semibold">GST / Reg. No:</span>{" "}
            {mess.admin_gst_number || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MessDetailModal;