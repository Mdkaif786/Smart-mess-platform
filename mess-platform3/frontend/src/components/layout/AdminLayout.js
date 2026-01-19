import React from "react";

function AdminLayout({ children, onNavigate }) {
  return (
    <div className="flex min-h-screen animated-light text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-6 border-r border-white/40">
        <h2 className="text-3xl font-extrabold mb-12 text-purple-700">
          SmartMess Admin
        </h2>

        <ul className="space-y-5 font-semibold text-lg">
          <li
            onClick={() => onNavigate("dashboard")}
            className="cursor-pointer hover:text-purple-600"
          >
            Dashboard
          </li>
          <li
            onClick={() => onNavigate("enrolledStudents")}
            className="cursor-pointer hover:text-purple-600"
          >
            Enrolled Students
          </li>
          <li
            onClick={() => onNavigate("manageNotices")}
            className="cursor-pointer hover:text-purple-600"
          >
            Manage Notices
          </li>
          <li
            onClick={() => onNavigate("manageMess")}
            className="cursor-pointer hover:text-purple-600"
          >
            Manage Mess
          </li>
          {/* v3 items keep them if you want */}
          <li
            onClick={() => onNavigate("menu")}
            className="cursor-pointer hover:text-purple-600"
          >
            Mess Menu
          </li>
          <li
            onClick={() => onNavigate("settings")}
            className="cursor-pointer hover:text-purple-600"
          >
            Account Settings
          </li>
        </ul>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="mt-12 w-full bg-red-600 text-white py-2 rounded-xl"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}

export default AdminLayout;