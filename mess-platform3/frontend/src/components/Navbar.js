import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">Mess Platform</h1>

      <div className="flex gap-6 items-center">
        {!token && (
          <>
            <Link to="/" className="hover:text-blue-400">Home</Link>
            <Link to="/login" className="hover:text-blue-400">Login</Link>
            <Link to="/register" className="hover:text-blue-400">Register</Link>
          </>
        )}

        {token && role === "student" && (
          <>
            <Link to="/student-dashboard" className="hover:text-blue-400">Student Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        )}

        {token && role === "mess_admin" && (
          <>
            <Link to="/admin-dashboard" className="hover:text-blue-400">Admin Dashboard</Link>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
