import React from "react";

function StudentLayout({ children, onNavigate }) {
  return (
    <div className="flex min-h-screen animated-light text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-6 border-r border-white/40">
        <h2 className="text-3xl font-extrabold mb-12 text-blue-700">
          SmartMess Student
        </h2>

        <ul className="space-y-5 font-semibold text-lg">
          <li
            onClick={() => onNavigate("dashboard")}
            className="cursor-pointer hover:text-blue-600"
          >
            Dashboard
          </li>
          <li
            onClick={() => onNavigate("explore")}
            className="cursor-pointer hover:text-blue-600"
          >
            Explore Messes
          </li>
          <li
            onClick={() => onNavigate("attendance")}
            className="cursor-pointer hover:text-blue-600"
          >
            Attendance History
          </li>
          <li
            onClick={() => onNavigate("notices")}
            className="cursor-pointer hover:text-blue-600"
          >
            Notices
          </li>
          {/* v3 items */}
          <li
            onClick={() => onNavigate("menu")}
            className="cursor-pointer hover:text-blue-600"
          >
            Mess Menu
          </li>
          <li
            onClick={() => onNavigate("settings")}
            className="cursor-pointer hover:text-blue-600"
          >
            Account Settings
          </li>
        </ul>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="mt-12 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-semibold shadow-md"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}

export default StudentLayout;