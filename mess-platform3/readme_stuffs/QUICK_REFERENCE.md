# Mess Platform - Quick Reference Guide

## 🏗️ System Overview

**Type**: Full-stack web application  
**Purpose**: Mess/Hostel dining management system  
**Architecture**: 3-Tier (Frontend → Backend → Database)

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19.2.0, React Router, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js 5.1.0 |
| **Database** | MySQL 3.15.3 |
| **Authentication** | JWT (JSON Web Tokens) |
| **Password Hashing** | bcrypt 6.0.0 |

---

## 👥 User Roles

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Student** | Regular users who join messes | View messes, Request enrollment, View menu/attendance/notices |
| **Mess Admin** | Manage individual mess | Create mess, Approve enrollments, Mark attendance, Manage menu, Create notices |
| **Super Admin** | System administrator | All admin features + Approve/reject messes, View all messes |

---

## 🔌 API Endpoints Quick Reference

### Authentication (`/auth`)
```
POST   /auth/register                    # Register new user
POST   /auth/login                       # Login
POST   /auth/logout                      # Logout
PUT    /auth/change-password             # Change password [🔒]
POST   /auth/forgot-password             # Get security question
POST   /auth/reset-password-with-answer  # Reset password
```

### Mess Management (`/mess`)
```
GET    /mess/all                         # Get all approved messes (Public)
POST   /mess/create                      # Create mess [🔒 mess_admin]
GET    /mess/my                          # Get admin's messes [🔒 mess_admin]
DELETE /mess/:id                         # Delete mess [🔒 mess_admin]
GET    /mess/pending                     # Get pending messes [🔒 super_admin]
PUT    /mess/:id/approve                 # Approve mess [🔒 super_admin]
PUT    /mess/:id/reject                  # Reject mess [🔒 super_admin]
GET    /mess/all-admin                   # Get all messes [🔒 super_admin]
```

### Enrollment (`/enrollment`)
```
POST   /enrollment/request/:messId       # Request enrollment [🔒 student]
GET    /enrollment/pending               # Get pending requests [🔒 mess_admin]
PUT    /enrollment/:id/approve           # Approve enrollment [🔒 mess_admin]
PUT    /enrollment/:id/reject            # Reject enrollment [🔒 mess_admin]
GET    /enrollment/my                    # Get student enrollment [🔒 student]
GET    /enrollment/students              # Get enrolled students [🔒 mess_admin]
```

### Attendance (`/attendance`)
```
POST   /attendance/mark                  # Mark attendance [🔒 mess_admin]
GET    /attendance/my                    # Get student attendance [🔒 student]
GET    /attendance/students              # Get all attendance [🔒 mess_admin]
```

### Menu (`/menu`)
```
GET    /menu/my                          # Get admin's menu [🔒 mess_admin]
POST   /menu/my                          # Save/update menu [🔒 mess_admin]
GET    /menu/all                         # Get all menus [🔒 student]
```

### Notice (`/notice`)
```
POST   /notice/create                    # Create notice [🔒 mess_admin]
GET    /notice/my-mess                   # Get mess notices [🔒 mess_admin]
GET    /notice/student                   # Get student notices [🔒 student]
```

*[🔒] = Protected route (requires JWT token)*

---

## 🗄️ Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | id, email, password_hash, role, phone, address |
| `messes` | Mess information | id, name, description, location, admin_id, status |
| `student_mess_enrollments` | Student-mess relationships | id, student_id, mess_id, status, is_current |
| `attendance` | Daily attendance records | id, student_id, mess_id, date, status |
| `menus` | Mess menu items | id, mess_id, day_of_week, breakfast, lunch, dinner |
| `notices` | Mess announcements | id, mess_id, title, content, created_by |

---

## 🔄 Key Workflows

### 1. Student Enrollment
```
Student → Browse Messes → Request Enrollment → 
Admin Approves → Student Enrolled
```

### 2. Mess Creation
```
Admin Creates Mess → Status: Pending → 
Super Admin Reviews → Approves/Rejects → 
Mess Available to Students (if approved)
```

### 3. Daily Operations
```
Admin Marks Attendance → Updates Menu → 
Creates Notices → Students View Updates
```

---

## 🔐 Authentication Flow

```
1. User submits credentials
   ↓
2. Backend verifies password
   ↓
3. JWT token generated
   ↓
4. Token stored in localStorage (frontend)
   ↓
5. Token included in Authorization header for protected routes
   ↓
6. Backend middleware verifies token on each request
```

---

## 📁 Project Structure

```
mess-platform3/
├── frontend/              # React application
│   ├── src/
│   │   ├── pages/        # Route components
│   │   ├── components/   # Reusable components
│   │   ├── App.js        # Main app with routing
│   │   └── index.js      # Entry point
│
└── backend/               # Express.js API
    ├── src/
    │   ├── routes/       # API route definitions
    │   ├── controllers/  # Business logic
    │   ├── models/       # Database queries
    │   ├── middlewares/  # Auth middleware
    │   ├── config/       # DB configuration
    │   ├── app.js        # Express app setup
    │   └── server.js     # Server entry point
```

---

## 🚀 Getting Started

### Backend
```bash
cd backend
npm install
# Configure .env file with database credentials
npm run dev  # Starts server on port 5000
```

### Frontend
```bash
cd frontend
npm install
npm start  # Starts dev server on port 3000
```

---

## 🔑 Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key
```

---

## 📊 Request Flow

```
Client Request
    ↓
CORS Check
    ↓
JSON Parser
    ↓
JWT Verification (if protected)
    ↓
Route Handler
    ↓
Controller
    ↓
Model/Database
    ↓
Response
```

---

## 🛡️ Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Protected routes (frontend + backend)
- ✅ CORS configuration
- ✅ Parameterized SQL queries (SQL injection prevention)
- ✅ Security questions for password recovery

---

## 📝 Common Tasks

### Add a new API endpoint
1. Create model in `backend/src/models/`
2. Create controller in `backend/src/controllers/`
3. Add route in `backend/src/routes/`
4. Register route in `backend/src/app.js`

### Add a new frontend page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.js`
3. Create protected route if needed
4. Add navigation link in `Navbar.js`

### Add authentication to endpoint
1. Import `verifyToken` middleware
2. Add middleware to route: `router.get('/path', verifyToken, controller)`

---

## 📚 Documentation Files

- **SYSTEM_ARCHITECTURE.md** - Complete architecture documentation
- **ARCHITECTURE_DIAGRAMS.md** - Visual diagrams and flows
- **QUICK_REFERENCE.md** - This file (quick lookup guide)

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check backend CORS configuration in `app.js` |
| JWT token invalid | Verify JWT_SECRET matches, check token expiration |
| Database connection failed | Verify DB credentials in `.env` file |
| 401 Unauthorized | Check if token is included in Authorization header |
| Route not found | Verify route is registered in `app.js` |

---

## 📞 Support Notes

- All protected routes require `Authorization: Bearer <token>` header
- User role stored in JWT token and localStorage
- Mess statuses: `pending`, `approved`, `rejected`
- Enrollment statuses: `pending`, `approved`, `rejected`
- Attendance statuses: `present`, `absent`



