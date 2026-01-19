import React from "react";

function SuperAdminLayout({ children }) {
  return (
    <div className="flex min-h-screen animated-light text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-6 border-r border-white/40">
        <h2 className="text-3xl font-extrabold mb-10 text-red-700">
          SmartMess Super Admin
        </h2>

        <ul className="space-y-5 font-semibold text-lg">
          <li className="cursor-default text-gray-800">
            Pending Messes
          </li>
        </ul>

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

export default SuperAdminLayout;