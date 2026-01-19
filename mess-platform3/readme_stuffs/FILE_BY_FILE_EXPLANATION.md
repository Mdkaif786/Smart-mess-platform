# 📁 File-by-File Explanation - Mess Platform

This document explains each important file in your project in simple terms. Read this as you go through your code!

---

## 🎯 How to Use This Guide

1. Open the actual file in your code editor
2. Read the explanation here
3. Compare with the actual code
4. Understand what each part does

---

## 📂 BACKEND FILES

### 1. `backend/server.js` (Entry Point)

**What it does**: Starts your backend server

```javascript
const app = require("./src/app");
```
- **Meaning**: Import the Express app we created in app.js

```javascript
const PORT = process.env.PORT || 5000;
```
- **Meaning**: Use port from .env file, or default to 5000
- **Why**: Makes it easy to change port without editing code

```javascript
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
- **Meaning**: Start the server and listen on the port
- **What happens**: Server starts and waits for requests

**Simple Explanation**: This file is like pressing the "ON" button for your backend server.

---

### 2. `backend/src/app.js` (Server Configuration)

**What it does**: Sets up Express server and connects all routes

#### Part 1: Import Libraries
```javascript
const express = require("express");
```
- **Meaning**: Get Express framework (makes building server easier)

```javascript
const cors = require("cors");
```
- **Meaning**: Allow frontend (different port) to talk to backend
- **Why needed**: Frontend runs on port 3000, backend on 5000 - need permission

```javascript
require("dotenv").config();
```
- **Meaning**: Load environment variables from .env file (database passwords, secrets)

```javascript
const pool = require("./config/db");
```
- **Meaning**: Get database connection pool (reusable database connections)

#### Part 2: Create Express App
```javascript
const app = express();
```
- **Meaning**: Create the Express application

#### Part 3: Middleware (Runs before routes)
```javascript
app.use(cors());
```
- **Meaning**: Allow requests from frontend (Cross-Origin Resource Sharing)

```javascript
app.use(express.json());
```
- **Meaning**: Parse JSON data from requests (convert string to JavaScript object)

#### Part 4: Routes (URL endpoints)

```javascript
app.get("/", (req, res) => {
  res.send("Mess Platform Backend Running ");
});
```
- **Meaning**: When someone visits root URL ("/"), send this message
- **Example**: Visit `http://localhost:5000/` → See "Mess Platform Backend Running"

```javascript
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);
```
- **Meaning**: 
  - Load all authentication routes
  - Mount them at `/auth` prefix
  - Example: Route in auth.routes.js called `/login` becomes `/auth/login`

Same pattern for other routes:
- `/mess` → mess routes
- `/enrollment` → enrollment routes
- etc.

**Simple Explanation**: This file is like a receptionist - it directs requests to the right department (routes).

---

### 3. `backend/src/config/db.js` (Database Connection)

**What it does**: Connects to MySQL database

```javascript
const mysql = require("mysql2/promise");
```
- **Meaning**: Get MySQL library (promise version = uses async/await)

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```
- **Meaning**: Create a connection pool (group of reusable database connections)
- **Why pool?**: Creating new connection each time is slow. Pool keeps connections ready.

**Config options**:
- `host`: Database server address
- `user`: Database username
- `password`: Database password
- `database`: Database name
- `connectionLimit: 10`: Max 10 connections at once

**Simple Explanation**: This is like a phone line to your database - it sets up the connection.

---

### 4. `backend/src/routes/auth.routes.js` (Authentication Routes)

**What it does**: Defines URLs for authentication (login, register, etc.)

```javascript
const express = require("express");
const router = express.Router();
```
- **Meaning**: Create a router (group of routes)

```javascript
const authController = require("../controllers/auth.controller");
```
- **Meaning**: Import controller (the actual logic/function)

```javascript
const { verifyToken } = require("../middlewares/auth.middleware");
```
- **Meaning**: Import middleware to check if user is logged in

#### Route Definitions:

```javascript
router.post("/register", authController.register);
```
- **Meaning**: When POST request comes to `/register`, call `register` function from controller
- **Full URL**: `/auth/register` (because mounted at `/auth` in app.js)

```javascript
router.post("/login", authController.login);
```
- **Meaning**: Login endpoint

```javascript
router.put("/change-password", verifyToken, authController.changePassword);
```
- **Meaning**: 
  - PUT request to `/change-password`
  - `verifyToken` runs first (checks if logged in)
  - If valid, then run `changePassword` controller

**Simple Explanation**: This file is like a menu - it lists what URLs are available and what they do.

---

### 5. `backend/src/controllers/auth.controller.js` (Login/Register Logic)

**What it does**: Contains the actual business logic for authentication

#### REGISTER Function:

```javascript
exports.register = async (req, res) => {
```
- **Meaning**: Export a function called `register`
- **async**: Function can wait for database operations
- **req**: Request object (data from frontend)
- **res**: Response object (send data back)

```javascript
const { name, email, password, role, ... } = req.body;
```
- **Meaning**: Extract data from request body (what frontend sent)
- **Example**: If frontend sends `{name: "Kaif", email: "kaif@email.com"}`, we get those values

```javascript
if (!name || !email || !password) {
  return res.status(400).json({ success: false, message: "..." });
}
```
- **Meaning**: Validation - check if required fields are present
- **If missing**: Send error response (400 = Bad Request) and stop

```javascript
const existingUser = await User.findByEmail(email);
if (existingUser.length > 0) {
  return res.status(400).json({ message: "Email already registered." });
}
```
- **Meaning**: 
  - Check if email already exists in database
  - If exists, send error
  - **await**: Wait for database query to finish

```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```
- **Meaning**: Hash password (convert to unreadable string)
- **Why**: Never store passwords in plain text (security)

```javascript
await User.create({ name, email, password_hash: hashedPassword, ... });
```
- **Meaning**: Save new user to database
- **User.create**: Function from model that inserts into database

```javascript
res.json({ success: true, message: "User registered successfully." });
```
- **Meaning**: Send success response back to frontend

#### LOGIN Function:

```javascript
exports.login = async (req, res) => {
  const { email, password } = req.body;
```
- **Meaning**: Get email and password from request

```javascript
const users = await User.findByEmail(email);
if (users.length === 0) {
  return res.status(400).json({ message: "Invalid email or password." });
}
```
- **Meaning**: Find user by email, if not found return error

```javascript
const isValidPassword = await bcrypt.compare(password, user.password_hash);
```
- **Meaning**: Compare entered password with stored hash
- **bcrypt.compare**: Checks if password matches hash

```javascript
const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
```
- **Meaning**: Create JWT token with user info
- **jwt.sign**: Creates the token
- **{ id, role }**: Data stored in token
- **expiresIn: "7d"**: Token valid for 7 days

```javascript
res.json({ success: true, token, user: { id, name, role, email } });
```
- **Meaning**: Send token and user data back to frontend

**Simple Explanation**: This file is like the brain - it contains the logic of what to do when someone registers or logs in.

---

### 6. `backend/src/models/user.model.js` (Database Queries)

**What it does**: Functions that talk directly to database

```javascript
const pool = require("../config/db");
```
- **Meaning**: Get database connection pool

```javascript
exports.findByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows;
};
```
- **Meaning**: 
  - Function to find user by email
  - `pool.query`: Execute SQL query
  - `?` is placeholder (prevents SQL injection)
  - `[email]`: Value to replace `?` with
  - Returns matching users

```javascript
exports.create = async ({ name, email, password_hash, role, ... }) => {
  return pool.query(
    `INSERT INTO users (name, email, password_hash, role, ...) VALUES (?, ?, ?, ?, ...)`,
    [name, email, password_hash, role, ...]
  );
};
```
- **Meaning**: Insert new user into database
- **INSERT INTO**: SQL command to add new row
- Parameters are in same order as columns

```javascript
exports.findById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows;
};
```
- **Meaning**: Find user by ID

**Simple Explanation**: This file is like a translator - it converts JavaScript function calls into SQL database queries.

---

### 7. `backend/src/middlewares/auth.middleware.js` (Security Check)

**What it does**: Checks if user is logged in (verifies JWT token)

```javascript
const jwt = require("jsonwebtoken");
```
- **Meaning**: Import JWT library to verify tokens

```javascript
exports.verifyToken = (req, res, next) => {
```
- **Meaning**: Middleware function
- **next**: Call this to continue to next middleware/route

```javascript
const authHeader = req.headers.authorization;
```
- **Meaning**: Get Authorization header from request
- **Example**: `Authorization: Bearer eyJhbGc...`

```javascript
if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return res.status(401).json({ message: "No token provided." });
}
```
- **Meaning**: Check if token exists and has "Bearer " prefix
- **If not**: Send 401 Unauthorized error

```javascript
const token = authHeader.split(" ")[1];
```
- **Meaning**: Extract token (remove "Bearer " part)
- **Example**: "Bearer abc123" → "abc123"

```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
next();
```
- **Meaning**: 
  - Verify token is valid (not expired, not tampered)
  - Extract user data from token
  - Attach to request object
  - Continue to next middleware/route

**Simple Explanation**: This is like a security guard - it checks your ID (token) before letting you in.

---

## 📂 FRONTEND FILES

### 8. `frontend/src/index.js` (Entry Point)

**What it does**: Starts the React application

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
```
- **Meaning**: Import React, ReactDOM, and main App component

```javascript
const root = ReactDOM.createRoot(document.getElementById("root"));
```
- **Meaning**: Find HTML element with id="root" and make it React's root

```javascript
root.render(<App />);
```
- **Meaning**: Render App component inside root element

**Simple Explanation**: This is like the starting point - it tells React where to put the app on the webpage.

---

### 9. `frontend/src/App.js` (Main App with Routing)

**What it does**: Sets up all routes (which page to show for which URL)

```javascript
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
```
- **Meaning**: Import routing components
- **BrowserRouter**: Enables routing
- **Routes**: Container for all routes
- **Route**: Individual route definition

```javascript
import Home from "./pages/Home";
import Login from "./pages/Login";
```
- **Meaning**: Import page components

```javascript
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
```
- **Meaning**: 
  - `<Router>`: Enable routing
  - `<Navbar />`: Show navbar on all pages
  - `<Route path="/login" element={<Login />} />`: When URL is `/login`, show Login component

```javascript
<Route
  path="/student-dashboard"
  element={
    <ProtectedRoute roleRequired="student">
      <StudentDashboard />
    </ProtectedRoute>
  }
/>
```
- **Meaning**: Protected route - only students can access
- **ProtectedRoute**: Checks if user is logged in and has correct role

**Simple Explanation**: This file is like a map - it tells React which page to show for each URL.

---

### 10. `frontend/src/pages/Login.js` (Login Page)

**What it does**: Login form component

```javascript
import { useState } from "react";
```
- **Meaning**: Import useState hook (for storing data that changes)

```javascript
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
```
- **Meaning**: 
  - Create state variables for email and password
  - `email`: Current email value
  - `setEmail`: Function to update email
  - `""`: Initial value (empty string)

```javascript
const handleLogin = async () => {
```
- **Meaning**: Function that runs when user clicks Login button
- **async**: Can wait for API call

```javascript
const response = await axios.post("http://localhost:5000/auth/login", {
  email,
  password,
});
```
- **Meaning**: 
  - Send POST request to backend
  - Send email and password in request body
  - **await**: Wait for response
  - **axios.post**: HTTP POST request

```javascript
const { token, user } = response.data;
```
- **Meaning**: Extract token and user data from response

```javascript
localStorage.setItem("token", token);
localStorage.setItem("role", user.role);
```
- **Meaning**: Save token and role in browser storage (persists even after refresh)

```javascript
navigate("/student-dashboard");
```
- **Meaning**: Redirect user to student dashboard

```javascript
<input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```
- **Meaning**: 
  - Input field for email
  - `value={email}`: Display current email state
  - `onChange`: When user types, update email state
  - `e.target.value`: What user typed

**Simple Explanation**: This is the login form - user enters credentials, we send to backend, save token, and redirect.

---

### 11. `frontend/src/components/ProtectedRoute.js` (Route Guard)

**What it does**: Protects routes - only allows logged-in users with correct role

```javascript
function ProtectedRoute({ children, roleRequired }) {
```
- **Meaning**: Component that wraps protected pages
- **children**: The component inside (like StudentDashboard)
- **roleRequired**: What role is needed (like "student")

```javascript
const role = localStorage.getItem("role");
```
- **Meaning**: Get user's role from browser storage

```javascript
if (!role) {
  return <Navigate to="/login" replace />;
}
```
- **Meaning**: If no role (not logged in), redirect to login

```javascript
if (roleRequired && role !== roleRequired) {
  if (role === "student") {
    return <Navigate to="/student-dashboard" replace />;
  }
  ...
}
```
- **Meaning**: If user has wrong role, redirect to their dashboard

```javascript
return children;
```
- **Meaning**: If everything OK, show the protected page

**Simple Explanation**: This is like a bouncer - it checks if you're allowed in before showing the page.

---

## 🔄 How Files Work Together - Complete Flow Example

### User Login Flow:

```
1. User opens browser → frontend/src/index.js runs
   ↓
2. App.js loads → Shows Login page (route: /login)
   ↓
3. User enters email/password in Login.js
   ↓
4. User clicks Login → handleLogin() runs
   ↓
5. Frontend sends POST request to backend: http://localhost:5000/auth/login
   ↓
6. Backend server.js receives request
   ↓
7. app.js routes to /auth → auth.routes.js
   ↓
8. auth.routes.js calls auth.controller.js → login function
   ↓
9. Controller calls user.model.js → findByEmail()
   ↓
10. Model queries database (db.js connection)
    ↓
11. Database returns user data
    ↓
12. Controller compares password, creates JWT token
    ↓
13. Controller sends response with token
    ↓
14. Frontend Login.js receives response
    ↓
15. Frontend saves token in localStorage
    ↓
16. Frontend redirects to dashboard
    ↓
17. App.js shows StudentDashboard (protected by ProtectedRoute)
```

---

## 📝 Key Concepts Recap

1. **Backend Flow**: Route → Controller → Model → Database → Response
2. **Frontend Flow**: Component → API Call → Update State → Re-render
3. **Authentication**: Login → Get Token → Store Token → Send Token with Requests
4. **State Management**: useState for component state, localStorage for persistence
5. **Routing**: URL → Route → Component

---

## ✅ Practice Exercise

Try to trace this flow yourself:
1. User registers new account
2. User logs in
3. Student views available messes
4. Student requests enrollment
5. Admin approves enrollment

Follow the files: Which route? Which controller? Which model? What database query?

---

This is a lot to take in! Don't worry if you don't understand everything immediately. 
Go through each file slowly, and ask questions. The more you practice, the clearer it becomes! 🚀



