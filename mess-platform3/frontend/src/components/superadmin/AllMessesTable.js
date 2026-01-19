// src/components/superadmin/AllMessesTable.js
import React from "react";
import GlassBox from "../ui/GlassBox";

function AllMessesTable({ allMesses, onApprove, onReject, onViewDetails }) {
  const renderStatusBadge = (status) => {
    let cls = "bg-gray-100 text-gray-800";
    let label = status;

    if (status === "approved") {
      cls = "bg-green-100 text-green-800";
      label = "Approved";
    } else if (status === "pending") {
      cls = "bg-yellow-100 text-yellow-800";
      label = "Pending";
    } else if (status === "rejected") {
      cls = "bg-red-100 text-red-800";
      label = "Rejected";
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}
      >
        {label}
      </span>
    );
  };

  if (!allMesses || allMesses.length === 0) {
    return (
      <GlassBox>
        <p className="text-gray-700">
          No messes have been created yet.
        </p>
      </GlassBox>
    );
  }

  return (
    <GlassBox>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Mess</th>
              <th className="py-2">Location</th>
              <th className="py-2">Status</th>
              <th className="py-2">Admin</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allMesses.map((m) => (
              <tr key={m.id} className="border-b align-top">
                <td className="py-2 pr-4">
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-gray-600">
                    {m.description || "No description"}
                  </p>
                </td>
                <td className="py-2 pr-4">{m.location}</td>
                <td className="py-2 pr-4">
                  {renderStatusBadge(m.status)}
                </td>
                <td className="py-2 pr-4">
                  <p className="text-sm font-semibold">
                    {m.admin_name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {m.admin_email}
                  </p>
                  <p className="text-xs text-gray-600">
                    {m.admin_phone}
                  </p>
                </td>
                <td className="py-2">
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetails(m)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-xs font-semibold"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onApprove(m.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                    >
                      Set Approved
                    </button>
                    <button
                      type="button"
                      onClick={() => onReject(m.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-semibold"
                    >
                      Set Rejected
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassBox>
  );
}

export default AllMessesTable;