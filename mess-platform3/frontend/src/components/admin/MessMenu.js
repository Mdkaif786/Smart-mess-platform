// src/components/admin/MessMenu.js
import { useEffect, useState } from "react";
import axios from "axios";
import GlassBox from "../ui/GlassBox";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const initialMenuState = DAYS.reduce(
  (acc, day) => ({
    ...acc,
    [day]: { lunch: "", dinner: "" },
  }),
  {}
);

function MessMenu() {
  const [menu, setMenu] = useState(initialMenuState);
  const [messInfo, setMessInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchMenu = async () => {
    try {
      const res = await axios.get("http://localhost:5000/menu/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { mess, menu: backendMenu } = res.data;
      setMessInfo(mess || null);

      if (backendMenu) {
        setMenu((prev) => ({
          ...prev,
          ...backendMenu,
        }));
      }
    } catch (err) {
      console.error("Error fetching menu", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleChange = (day, field, value) => {
    setMenu((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const saveMenu = async () => {
    try {
      await axios.post(
        "http://localhost:5000/menu/my",
        { menu },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Menu saved successfully");
    } catch (err) {
      alert(
        err.response?.data?.message || "Error saving menu"
      );
    }
  };

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (!messInfo) {
    return (
      <GlassBox>
        <h2 className="text-2xl font-bold mb-2">No Mess Found</h2>
        <p className="text-gray-600">
          Please create a mess first to manage its menu.
        </p>
      </GlassBox>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-6">
        Mess Menu – {messInfo.name}
      </h1>

      <p className="mb-6 text-gray-600">
        Set the weekly lunch and dinner menu. Leave fields empty if you
        don't want to set anything for a particular slot.
      </p>

      <div className="space-y-6">
        {DAYS.map((day) => (
          <GlassBox key={day} className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              {DAY_LABELS[day]}
            </h2>

            <div className="mb-4">
              <label className="font-semibold block mb-2">
                Lunch
              </label>
              <textarea
                value={menu[day].lunch}
                onChange={(e) =>
                  handleChange(day, "lunch", e.target.value)
                }
                className="w-full p-3 rounded-xl border min-h-[60px]"
                placeholder="Describe lunch menu..."
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Dinner
              </label>
              <textarea
                value={menu[day].dinner}
                onChange={(e) =>
                  handleChange(day, "dinner", e.target.value)
                }
                className="w-full p-3 rounded-xl border min-h-[60px]"
                placeholder="Describe dinner menu..."
              />
            </div>
          </GlassBox>
        ))}
      </div>

      <button
        onClick={saveMenu}
        className="mt-8 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold"
      >
        Save Menu
      </button>
    </div>
  );
}

export default MessMenu;