// src/components/admin/ManageMess.js
import { useState, useEffect } from "react";
import GlassBox from "../ui/GlassBox";

/**
 * Props:
 *  - mess: existing mess object or null
 *  - mode: "create" | "edit"
 *  - onCreate(form)
 *  - onUpdate(form)
 *  - onDelete()
 *  - onCancel()
 */
function ManageMess({
  mess,
  mode = "edit",
  onCreate,
  onUpdate,
  onDelete,
  onCancel,
}) {
  const isCreateMode = mode === "create" || !mess;

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
  });

  // Initialize form with current mess data (for edit mode)
  useEffect(() => {
    if (!isCreateMode && mess) {
      setForm({
        name: mess.name || "",
        description: mess.description || "",
        location: mess.location || "",
      });
    } else {
      setForm({
        name: "",
        description: "",
        location: "",
      });
    }
  }, [mess, isCreateMode]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert("Mess name is required");
      return;
    }

    if (isCreateMode) {
      if (typeof onCreate === "function") {
        onCreate(form);
      } else {
        console.warn("onCreate is not provided");
      }
    } else {
      if (typeof onUpdate === "function") {
        onUpdate(form);
      } else {
        console.warn("onUpdate is not provided");
      }
    }
  };

  return (
    <GlassBox className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">
        {isCreateMode ? "Create Mess" : "Manage Mess"}
      </h2>

      {/* Mess Name */}
      <div className="mb-4">
        <label className="font-semibold">Mess Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full mt-2 p-3 rounded-xl border"
          placeholder="Enter mess name"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="font-semibold">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full mt-2 p-3 rounded-xl border"
          placeholder="Optional: describe your mess"
        />
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="font-semibold">Location</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full mt-2 p-3 rounded-xl border"
          placeholder="Mess address / hostel location"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          {isCreateMode ? "request to Create Mess" : "Save Changes"}
        </button>

        {!isCreateMode && (
          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Delete Mess
          </button>
        )}

        <button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Cancel
        </button>
      </div>
    </GlassBox>
  );
}

export default ManageMess;