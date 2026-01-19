## Smart Mess Platform 3

This repository contains a **Node.js backend** and a **React frontend** for the Smart Mess Platform.

### 1. Prerequisites
- **Node.js** (LTS version recommended)
- **npm** (comes with Node.js)
- A running **MySQL** instance (or the DB your backend is configured for)

---

### 2. Backend Setup (`mess-platform3/backend`)
1. Open a terminal and go to the backend folder:
   ```bash
   cd mess-platform3/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in `mess-platform3/backend` (if not already present).
   - Add your database credentials and JWT/other secrets as required by `src/config/db.js` and auth logic.
4. Start the backend in development mode:
   ```bash
   npm run dev
   ```
5. The backend will start on the port defined in your server (commonly something like `http://localhost:5000`).

---

### 3. Frontend Setup (`mess-platform3/frontend`)
1. In a new terminal, go to the frontend folder:
   ```bash
   cd mess-platform3/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```
4. Open the app in your browser (by default):
   - `http://localhost:3000`

Make sure the **backend is running** and the frontend is configured to call the correct backend URL (e.g. via environment variables or config files).

---

### 4. Notes
- The folder `readme_stuffs/` is **not needed to run the project** and is intentionally **ignored in git**.
- For architecture diagrams, refer to the `.jpeg` files in the project root.

