// src/pages/Login.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token & basic user info in localStorage (v2 behavior)
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      setMessage("Login Successful! Redirecting...");

      setTimeout(() => {
        if (user.role === "student") {
          navigate("/student-dashboard");
        } else if (user.role === "mess_admin") {
          navigate("/admin-dashboard");
        } else if (user.role === "super_admin") {
          navigate("/super-admin-dashboard");
        } else {
          // fallback
          navigate("/");
        }
      }, 1200);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Invalid email or password."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen animated-light">
      <div className="glass-box p-10 rounded-3xl shadow-xl w-[420px]">
        <h2 className="text-3xl font-extrabold mb-6 text-center">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Login to continue
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-xl mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold hover:scale-105 transition"
        >
          Login
        </button>

        <p
          className="text-center mt-3 text-sm text-blue-700 font-semibold cursor-pointer hover:underline"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot your password?
        </p>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <span
            className="text-blue-700 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

        {message && (
          <p className="text-center mt-4 font-semibold text-red-600">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;