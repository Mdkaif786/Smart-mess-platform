import { useState, useEffect } from "react";
import axios from "axios";

function CreateMess() {
  const [mess, setMess] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const token = localStorage.getItem("token");

  const fetchMyMess = async () => {
    const res = await axios.get("http://localhost:5000/mess/my", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMess(res.data.mess);
  };

  useEffect(() => {
    fetchMyMess();
  }, []);

  const createMess = async () => {
    try {
      await axios.post(
        "http://localhost:5000/mess/create",
        { name, description, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Mess created successfully");
      fetchMyMess();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating mess");
    }
  };

  const deleteMess = async () => {
    try {
      await axios.delete(`http://localhost:5000/mess/delete/${mess.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Mess deleted");
      setMess(null);
    } catch (err) {
      alert("Error deleting mess");
    }
  };

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Mess</h1>

      {!mess ? (
        <div className="glass-box p-6 rounded-xl w-96">
          <input
            placeholder="Mess Name"
            className="w-full border p-3 rounded mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Location"
            className="w-full border p-3 rounded mb-3"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full border p-3 rounded mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={createMess}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl w-full"
          >
            Create Mess
          </button>
        </div>
      ) : (
        <div className="glass-box p-6 rounded-xl w-96">
          <h2 className="text-2xl font-bold mb-2">{mess.name}</h2>
          <p>{mess.description}</p>
          <p className="mb-4 text-gray-600">{mess.location}</p>
          <button
            onClick={deleteMess}
            className="bg-red-600 text-white px-6 py-3 rounded-xl w-full"
          >
            Delete Mess
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateMess;
