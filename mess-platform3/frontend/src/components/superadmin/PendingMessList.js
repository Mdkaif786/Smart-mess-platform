// src/components/superadmin/PendingMessList.js
import React from "react";
import GlassBox from "../ui/GlassBox";

function PendingMessList({ pendingMesses, onApprove, onReject }) {
  if (!pendingMesses || pendingMesses.length === 0) {
    return (
      <GlassBox>
        <p className="text-gray-700">
          There are no pending messes to approve.
        </p>
      </GlassBox>
    );
  }

  return (
    <div className="space-y-6">
      {pendingMesses.map((m) => (
        <GlassBox key={m.id}>
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            {/* Left: Mess info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">
                {m.name}
              </h3>
              <p className="text-gray-700 mb-1">
                {m.description || "No description"}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Location: {m.location}
              </p>
            </div>

            {/* Right: Admin info + actions */}
            <div className="w-full md:w-80 flex flex-col gap-3">
              <div className="border border-white/40 rounded-xl p-3 bg-white/40">
                <p className="text-sm font-semibold mb-1">
                  Mess Admin Details
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Name:</span>{" "}
                  {m.admin_name}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Email:</span>{" "}
                  {m.admin_email}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Phone:</span>{" "}
                  {m.admin_phone}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Address:</span>{" "}
                  {m.admin_address || "Not provided"}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">
                    GST / Reg. No:
                  </span>{" "}
                  {m.admin_gst_number || "Not provided"}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onApprove(m.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => onReject(m.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </GlassBox>
      ))}
    </div>
  );
}

export default PendingMessList;