// src/components/student/AttendanceCalendar.js
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import GlassBox from "../ui/GlassBox";

function formatLocalDate(date) {
  // yyyy-mm-dd in LOCAL time (NO timezone shift)
  return date.toLocaleDateString("en-CA");
}

/**
 * props:
 *  - history: [{ date, status, mess_id }, ...]
 *  - messes: [{ id, name }, ...]  (approved messes)
 */
function AttendanceCalendar({ history, messes = [] }) {
  const [selectedMessId, setSelectedMessId] = useState(
    messes.length > 0 ? messes[0].id : null
  );

  // Keep selected mess valid when mess list changes
  useEffect(() => {
    if (messes.length === 0) {
      setSelectedMessId(null);
      return;
    }
    if (!selectedMessId || !messes.some((m) => m.id === selectedMessId)) {
      setSelectedMessId(messes[0].id);
    }
  }, [messes, selectedMessId]);

  // Filter history by selected mess (coerce to Number in case of string/number mismatch)
  const filteredHistory =
    selectedMessId == null
      ? []
      : history.filter(
          (h) => Number(h.mess_id) === Number(selectedMessId)
        );

  // Build map: date -> status (present) for this mess
  const attendanceMap = {};
  filteredHistory.forEach((h) => {
    const localDate = formatLocalDate(new Date(h.date));
    attendanceMap[localDate] = h.status; // "present"
  });

  const tileClassName = ({ date, view }) => {
    if (view !== "month" || !selectedMessId) return null;

    const dateStr = formatLocalDate(date);

    // Only color days where there is a "present" record
    if (attendanceMap[dateStr] === "present") {
      return "present-day";
    }

    return null;
  };

  if (messes.length === 0) {
    return (
      <div>
        <h1 className="text-4xl font-extrabold mb-10">
          Attendance Calendar
        </h1>
        <GlassBox>
          <p className="text-gray-600">
            You are not enrolled in any mess yet. Join a mess to see its
            attendance calendar.
          </p>
        </GlassBox>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-6">
        Attendance Calendar
      </h1>

      {/* Mess selector */}
      <div className="mb-6">
        <label className="font-semibold mr-3">Select Mess:</label>
        <select
          value={selectedMessId ?? ""}
          onChange={(e) => setSelectedMessId(Number(e.target.value))}
          className="border rounded-lg px-3 py-2"
        >
          {messes.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      <GlassBox>
        <Calendar tileClassName={tileClassName} />

        <div className="flex gap-6 mt-6 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-500 rounded"></span>
            Present
          </div>
        </div>
      </GlassBox>

      <style>{`
        .present-day {
          background: #22c55e !important;
          color: white !important;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

export default AttendanceCalendar;