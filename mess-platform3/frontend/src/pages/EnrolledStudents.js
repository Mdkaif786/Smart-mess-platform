// src/pages/EnrolledStudents.js
import { useEffect, useState } from "react";
import axios from "axios";

function EnrolledStudents() {
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem("token");

  const fetchEnrolledStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/enrollment/enrolled",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Error loading students", err);
    }
  };

  const removeStudent = async (id) => {
    if (!window.confirm("Remove this student from mess?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/enrollment/remove/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Student removed");
      fetchEnrolledStudents();
    } catch (err) {
      alert("Error removing student");
    }
  };

  useEffect(() => {
    fetchEnrolledStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Enrolled Students</h1>

      {students.length === 0 ? (
        <p>No students enrolled yet.</p>
      ) : (
        <div className="glass-box p-6 rounded-2xl shadow-xl border border-white/40">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr
                  key={s.student_id}
                  className="border-b border-gray-200"
                >
                  <td className="py-2">{s.student_name}</td>
                  <td>{s.email}</td>
                  <td>
                    <button
                      onClick={() => removeStudent(s.enrollment_id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EnrolledStudents;