import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentNotices from "./pages/StudentNotices";

import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="mt-6">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/student-dashboard" element={<ProtectedRoute roleRequired="student"><StudentDashboard /></ProtectedRoute>}/>
          <Route
            path="/student-notices" element={<ProtectedRoute roleRequired="student"><StudentNotices /></ProtectedRoute>}/>
          <Route
            path="/admin-dashboard" element={<ProtectedRoute roleRequired="mess_admin"><AdminDashboard /></ProtectedRoute>}/>
          <Route path="/forgot-password" element={<ForgotPassword />} />  
          <Route path="/super-admin-dashboard" element={ <ProtectedRoute
            roleRequired="super_admin"><SuperAdminDashboard /></ProtectedRoute>}/>
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
