import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [step, setStep] = useState("choose"); // "choose" | "form"

  const [role, setRole] = useState(null); // "student" | "mess_admin"

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Role-specific
  const [aadharNumber, setAadharNumber] = useState(""); // for students
  const [gstNumber, setGstNumber] = useState("");       // for admins

  // Security question/answer
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const startStudent = () => {
    setRole("student");
    setStep("form");
    setMessage("");
  };

  const startAdmin = () => {
    setRole("mess_admin");
    setStep("form");
    setMessage("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!role) {
      setMessage("Please select whether you are a Student or Mess Admin.");
      return;
    }

    // Basic validation
    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !password ||
      !confirmPassword ||
      !securityQuestion ||
      !securityAnswer
    ) {
      setMessage("Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    // Role-specific required fields
    if (role === "student" && !aadharNumber) {
      setMessage("Aadhar number is required for students.");
      return;
    }

    if (role === "mess_admin" && !gstNumber) {
      setMessage("GST number is required for mess admins.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        password,
        role,
        phone,
        address,
        aadharNumber: role === "student" ? aadharNumber : null,
        gstNumber: role === "mess_admin" ? gstNumber : null,
        securityQuestion,
        securityAnswer,
      });

      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen animated-light px-4">
      <div className="glass-box p-10 rounded-3xl shadow-xl w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold mb-2">
            Create your Smart Mess account
          </h2>
          <p className="text-gray-600">
            Please provide accurate details. These will be used for verification and communication.
          </p>
        </div>

        {/* STEP 1: choose role */}
        {step === "choose" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">
              Step 1 – Select account type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={startStudent}
                className="border border-blue-500 rounded-2xl p-6 text-left hover:bg-blue-50 transition"
              >
                <p className="text-sm font-semibold text-blue-600 uppercase mb-1">
                  Student
                </p>
                <p className="text-lg font-bold mb-1">
                  I want to join and mark attendance in messes
                </p>
                <p className="text-sm text-gray-600">
                  Register as a student to explore messes, join them, and mark your daily attendance.
                </p>
              </button>

              <button
                onClick={startAdmin}
                className="border border-purple-500 rounded-2xl p-6 text-left hover:bg-purple-50 transition"
              >
                <p className="text-sm font-semibold text-purple-600 uppercase mb-1">
                  Mess Admin
                </p>
                <p className="text-lg font-bold mb-1">
                  I want to manage a mess
                </p>
                <p className="text-sm text-gray-600">
                  Register as a mess admin to create and manage your mess, track attendance and menus.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: full form */}
        {step === "form" && (
          <form onSubmit={handleRegister} className="space-y-8">
            {/* Role & back */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Registering as
                </p>
                <p className="text-lg font-semibold">
                  {role === "student" ? "Student" : "Mess Admin"}
                </p>
              </div>
              <button
                type="button"
                className="text-blue-700 underline text-sm"
                onClick={() => {
                  setStep("choose");
                  setMessage("");
                }}
              >
                Change account type
              </button>
            </div>

            {/* Section: Basic information */}
            <section>
              <h3 className="text-lg font-semibold mb-4">
                Step 2 – Basic information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    What is your full name?
                  </label>
                  <input
                    type="text"
                    className="w-full border p-3 rounded-lg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    What is your email address?
                  </label>
                  <input
                    type="email"
                    className="w-full border p-3 rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="This will be used for login"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    What is your mobile number?
                  </label>
                  <input
                    type="text"
                    className="w-full border p-3 rounded-lg"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter a valid phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    What is your address?
                  </label>
                  <input
                    type="text"
                    className="w-full border p-3 rounded-lg"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Hostel / Room / Mess address"
                  />
                </div>
              </div>
            </section>

            {/* Section: Identity details (role specific) */}
            <section>
              <h3 className="text-lg font-semibold mb-4">
                Step 3 – Identity details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {role === "student" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      What is your Aadhar number?
                    </label>
                    <input
                      type="text"
                      className="w-full border p-3 rounded-lg"
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value)}
                      placeholder="Enter your Aadhar number"
                    />
                  </div>
                )}

                {role === "mess_admin" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      What is your GST / Business registration number?
                    </label>
                    <input
                      type="text"
                      className="w-full border p-3 rounded-lg"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="Enter GST / business number"
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Section: Security */}
            <section>
              <h3 className="text-lg font-semibold mb-4">
                Step 4 – Security question (for password recovery)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Choose a security question
                  </label>
                  <input
                    type="text"
                    className="w-full border p-3 rounded-lg"
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    placeholder="e.g. What is your pet name?"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    What is your answer to this question?
                  </label>
                  <input
                    type="text"
                    className="w-full border p-3 rounded-lg"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="You will need this if you forget your password"
                  />
                </div>
              </div>
            </section>

            {/* Section: Password */}
            <section>
              <h3 className="text-lg font-semibold mb-4">
                Step 5 – Set your password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Create a password
                  </label>
                  <input
                    type="password"
                    className="w-full border p-3 rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a strong password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm your password
                  </label>
                  <input
                    type="password"
                    className="w-full border p-3 rounded-lg"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter the same password"
                  />
                </div>
              </div>
            </section>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold hover:scale-[1.01] transition"
            >
              Create Account
            </button>
          </form>
        )}

        {/* Message */}
        {message && (
          <p className="text-center mt-6 font-semibold text-red-600">
            {message}
          </p>
        )}

        {/* Link to login */}
        <p className="text-center mt-4 text-sm text-gray-700">
          Already have an account?{" "}
          <span
            className="text-blue-700 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;