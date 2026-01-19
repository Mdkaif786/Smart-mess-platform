// src/pages/ForgotPassword.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = ask email, 2 = ask answer + new pw

  const [email, setEmail] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Step 1: submit email to get question
  const handleGetQuestion = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Please enter your registered email.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/forgot-password",
        { email }
      );

      if (res.data.success) {
        setSecurityQuestion(res.data.securityQuestion || "");
        setStep(2);
      } else {
        setMessage(res.data.message || "Unable to find account.");
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Error while fetching security question."
      );
    }
  };

  // Step 2: submit answer + new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!securityAnswer || !newPassword || !confirmNewPassword) {
      setMessage("Please fill all fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/reset-password-with-answer",
        {
          email,
          securityAnswer,
          newPassword,
        }
      );

      if (res.data.success) {
        setMessage("Password reset successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(res.data.message || "Unable to reset password.");
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Error while resetting password."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen animated-light px-4">
      <div className="glass-box p-10 rounded-3xl shadow-xl w-full max-w-xl">
        <h2 className="text-3xl font-extrabold mb-4 text-center">
          Reset your password
        </h2>
        <p className="text-gray-600 mb-8 text-center text-sm">
          Use your registered email and security question to reset your password.
        </p>

        {step === 1 && (
          <form onSubmit={handleGetQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                What is your registered email?
              </label>
              <input
                type="email"
                className="w-full border p-3 rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold hover:scale-[1.01] transition"
            >
              Get Security Question
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Your registered email
              </label>
              <input
                type="email"
                className="w-full border p-3 rounded-lg bg-gray-100"
                value={email}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Security question
              </label>
              <input
                type="text"
                className="w-full border p-3 rounded-lg bg-gray-100"
                value={securityQuestion}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Your answer
              </label>
              <input
                type="text"
                className="w-full border p-3 rounded-lg"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Enter your answer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  New password
                </label>
                <input
                  type="password"
                  className="w-full border p-3 rounded-lg"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Choose a new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Confirm new password
                </label>
                <input
                  type="password"
                  className="w-full border p-3 rounded-lg"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold hover:scale-[1.01] transition"
            >
              Reset Password
            </button>

            <button
              type="button"
              className="w-full mt-2 text-blue-700 underline text-sm"
              onClick={() => {
                setStep(1);
                setSecurityAnswer("");
                setNewPassword("");
                setConfirmNewPassword("");
                setMessage("");
              }}
            >
              Go back to email step
            </button>
          </form>
        )}

        {message && (
          <p className="text-center mt-6 font-semibold text-red-600">
            {message}
          </p>
        )}

        <p className="text-center mt-4 text-sm text-gray-700">
          Remembered your password?{" "}
          <span
            className="text-blue-700 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Go to login
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;