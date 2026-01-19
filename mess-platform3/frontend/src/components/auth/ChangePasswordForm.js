// src/components/auth/ChangePasswordForm.js
import { useState } from "react";
import axios from "axios";
import GlassBox from "../ui/GlassBox";

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setMessage("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      await axios.put(
        "http://localhost:5000/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Error while changing password."
      );
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">
        Account Settings
      </h1>

      <GlassBox className="max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Current password
            </label>
            <input
              type="password"
              className="w-full border p-3 rounded-lg"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              New password
            </label>
            <input
              type="password"
              className="w-full border p-3 rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Choose a new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm new password
            </label>
            <input
              type="password"
              className="w-full border p-3 rounded-lg"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Re-enter the new password"
            />
          </div>

          <button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Update Password
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm font-semibold text-red-600">
            {message}
          </p>
        )}
      </GlassBox>
    </div>
  );
}

export default ChangePasswordForm;