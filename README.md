## Smart Mess Platform 3

This repository contains a **Node.js backend** and a **React frontend** for the Smart Mess Platform.

This guide explains how **anyone** can download this repo and run it locally.

---

### 1. Prerequisites
- **Node.js** (LTS version recommended)
- **npm** (comes with Node.js)
- A running **MySQL** instance (or the DB your backend is configured for)

---

### 2. Project Structure
- `mess-platform3/backend` – Node.js/Express API + database
- `mess-platform3/frontend` – React UI (Create React App)

Some folders/files are **ignored by git** and must be created locally:
- `.env` (backend environment variables)
- `node_modules/` (installed automatically by `npm install`)

---

### 3. Backend Setup (`mess-platform3/backend`)

1. **Go to the backend folder**
   ```bash
   cd mess-platform3/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** (required)

   In `mess-platform3/backend`, create a file named `.env` and add variables similar to:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name

   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

   Adjust names/values to match your own MySQL setup and what `src/config/db.js` expects.

4. **Run database migrations / create tables (if needed)**

   - Create the database named in `DB_NAME` in MySQL.
   - Run any SQL scripts you have (or let the app create tables if it does that automatically).

5. **Start the backend server**
   ```bash
   npm run dev
   ```

   The backend will start on the port defined in `.env` (e.g. `http://localhost:5000`).

---

### 4. Frontend Setup (`mess-platform3/frontend`)

1. **Go to the frontend folder**
   ```bash
   cd mess-platform3/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **(Optional) Configure API base URL**

   If the frontend needs a custom backend URL, create a `.env` file in `mess-platform3/frontend` with something like:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

4. **Start the React app**
   ```bash
   npm start
   ```

5. **Open in browser**
   - By default: `http://localhost:3000`

Make sure the **backend is running** and that the frontend is pointing to the correct API base URL.

---

### 5. Notes
- The folder `readme_stuffs/` is **not needed to run the project** and is intentionally **ignored in git**.
- `.env` files and `node_modules/` are **not committed**; each developer must create their own `.env` and run `npm install`.
- For architecture diagrams, refer to the `.jpeg` files in the project root.

