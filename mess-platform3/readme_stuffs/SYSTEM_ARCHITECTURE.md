# Mess Platform System Architecture

## Table of Contents
1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Component Breakdown](#component-breakdown)
5. [Data Flow](#data-flow)
6. [API Structure](#api-structure)
7. [Database Schema Overview](#database-schema-overview)
8. [User Roles & Permissions](#user-roles--permissions)
9. [Key User Flows](#key-user-flows)
10. [Security Architecture](#security-architecture)

---

## System Overview

The **Mess Platform** is a web-based application designed to manage mess/hostel dining facilities. The system enables three types of users (Students, Mess Administrators, and Super Administrators) to interact with mess-related services including enrollment, attendance tracking, menu management, and notice distribution.

### Key Features
- User authentication and authorization
- Mess registration and approval workflow
- Student enrollment in messes
- Daily attendance tracking
- Menu management
- Notice distribution
- Role-based dashboard access

---

## Technology Stack

### Frontend
- **Framework**: React 19.2.0
- **Routing**: React Router DOM 7.9.6
- **HTTP Client**: Axios 1.13.2
- **Styling**: Tailwind CSS 3.4.13
- **Icons**: React Icons 5.5.0
- **Calendar**: React Calendar 6.0.0
- **PDF Generation**: jsPDF 3.0.4

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MySQL 3.15.3 (via mysql2)
- **Authentication**: JSON Web Tokens (JWT) 9.0.2
- **Password Hashing**: bcrypt 6.0.0
- **Security**: CORS 2.8.5, cookie-parser 1.4.7
- **Environment**: dotenv 17.2.3

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            React Frontend Application                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │  Pages   │  │Components│  │  Router  │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │ (Axios HTTP Client)
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Express.js Backend Server                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │  Routes    │→ │Controllers │→ │  Models    │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  │         │              │               │            │   │
│  │  ┌──────▼──────────────▼───────────────▼──────┐    │   │
│  │  │        Middleware Layer                      │    │   │
│  │  │  (Authentication, Authorization, CORS)      │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ SQL Queries
                            │ (Connection Pool)
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     DATA LAYER                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MySQL Database                           │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │   │
│  │  │ users  │ │ messes │ │enroll  │ │attendance│      │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │   │
│  │  ┌────────┐ ┌────────┐                              │   │
│  │  │ menus  │ │notices │                              │   │
│  │  └────────┘ └────────┘                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Architecture Pattern
The system follows a **3-Tier Architecture**:
1. **Presentation Tier**: React frontend
2. **Application Tier**: Express.js backend with RESTful API
3. **Data Tier**: MySQL database

---

## Component Breakdown

### Frontend Structure

```
frontend/
├── src/
│   ├── pages/                    # Route-level components
│   │   ├── Home.js               # Landing page
│   │   ├── Login.js              # Login page
│   │   ├── Register.js           # Registration page
│   │   ├── ForgotPassword.js     # Password recovery
│   │   ├── StudentDashboard.js   # Student main dashboard
│   │   ├── StudentNotices.js     # Student notices page
│   │   ├── AdminDashboard.js     # Mess admin dashboard
│   │   ├── SuperAdminDashboard.js # Super admin dashboard
│   │   └── ...
│   │
│   ├── components/               # Reusable components
│   │   ├── auth/
│   │   │   └── ChangePasswordForm.js
│   │   ├── student/
│   │   │   ├── StudentHome.js
│   │   │   ├── ExploreMesses.js
│   │   │   ├── AttendanceCalendar.js
│   │   │   └── StudentMessMenu.js
│   │   ├── admin/
│   │   │   ├── DashboardHome.js
│   │   │   ├── ManageMess.js
│   │   │   └── MessMenu.js
│   │   ├── superadmin/
│   │   │   ├── PendingMessList.js
│   │   │   ├── AllMessesTable.js
│   │   │   └── MessDetailModal.js
│   │   ├── notices/
│   │   │   ├── NoticeList.js
│   │   │   └── NoticeForm.js
│   │   ├── layout/
│   │   │   ├── StudentLayout.js
│   │   │   ├── AdminLayout.js
│   │   │   └── SuperAdminLayout.js
│   │   ├── ui/
│   │   │   ├── GlassBox.js
│   │   │   └── StatCard.js
│   │   ├── ProtectedRoute.js     # Route guard component
│   │   └── Navbar.js             # Navigation bar
│   │
│   ├── App.js                    # Main app component with routing
│   └── index.js                  # Entry point
```

### Backend Structure

```
backend/
├── src/
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   │
│   ├── config/
│   │   └── db.js                 # Database connection pool
│   │
│   ├── routes/                   # API route definitions
│   │   ├── auth.routes.js        # Authentication routes
│   │   ├── mess.routes.js        # Mess management routes
│   │   ├── enrollment.routes.js  # Enrollment routes
│   │   ├── attendance.routes.js  # Attendance routes
│   │   ├── menu.routes.js        # Menu routes
│   │   └── notice.routes.js      # Notice routes
│   │
│   ├── controllers/              # Business logic handlers
│   │   ├── auth.controller.js
│   │   ├── mess.controller.js
│   │   ├── enrollment.controller.js
│   │   ├── attendance.controller.js
│   │   ├── menu.controller.js
│   │   └── notice.controller.js
│   │
│   ├── models/                   # Database query models
│   │   ├── user.model.js
│   │   ├── mess.model.js
│   │   ├── enrollment.model.js
│   │   ├── attendance.model.js
│   │   ├── menu.model.js
│   │   └── notice.model.js
│   │
│   ├── middlewares/              # Custom middleware
│   │   └── auth.middleware.js    # JWT token verification
│   │
│   └── utils/                    # Utility functions
│
└── package.json
```

---

## Data Flow

### Request Flow

```
1. User Action (Frontend)
   ↓
2. React Component (Event Handler)
   ↓
3. Axios HTTP Request (with JWT token if authenticated)
   ↓
4. Express.js Server (Receives request)
   ↓
5. Middleware Layer
   ├── CORS check
   ├── JSON parsing
   └── JWT verification (for protected routes)
   ↓
6. Route Handler (Routes file)
   ↓
7. Controller (Business logic)
   ├── Input validation
   ├── Model interaction
   └── Database queries
   ↓
8. Database (MySQL)
   ├── Query execution
   └── Result returned
   ↓
9. Controller (Response formation)
   ↓
10. Express.js Response (JSON)
   ↓
11. Axios Response Handler (Frontend)
   ↓
12. React Component State Update
   ↓
13. UI Re-render
```

### Authentication Flow

```
Registration:
User Input → Frontend Validation → POST /auth/register
→ Controller (Hash password, Create user) → Database Insert
→ Response (User created)

Login:
User Credentials → POST /auth/login
→ Controller (Verify password) → Generate JWT Token
→ Response (Token + User data) → Store in localStorage
→ Redirect to role-based dashboard

Protected Route Access:
Component Load → Check localStorage for token
→ If token exists → Include in Authorization header
→ Middleware verifies JWT → Extract user info
→ Controller executes → Response returned
```

---

## API Structure

### Base URL
```
Backend: http://localhost:5000 (or configured port)
```

### API Endpoints

#### Authentication (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `PUT /auth/change-password` - Change password (Protected)
- `POST /auth/forgot-password` - Get security question
- `POST /auth/reset-password-with-answer` - Reset password with answer

#### Mess Management (`/mess`)
- `GET /mess/all` - Get all approved messes (Public)
- `POST /mess/create` - Create new mess (Protected: mess_admin)
- `GET /mess/my` - Get admin's messes (Protected: mess_admin)
- `DELETE /mess/:id` - Delete mess (Protected: mess_admin)
- `GET /mess/pending` - Get pending messes (Protected: super_admin)
- `PUT /mess/:id/approve` - Approve mess (Protected: super_admin)
- `PUT /mess/:id/reject` - Reject mess (Protected: super_admin)
- `GET /mess/all-admin` - Get all messes with admin info (Protected: super_admin)

#### Enrollment (`/enrollment`)
- `POST /enrollment/request/:messId` - Request enrollment (Protected: student)
- `GET /enrollment/pending` - Get pending requests (Protected: mess_admin)
- `PUT /enrollment/:id/approve` - Approve enrollment (Protected: mess_admin)
- `PUT /enrollment/:id/reject` - Reject enrollment (Protected: mess_admin)
- `GET /enrollment/my` - Get student's current enrollment (Protected: student)
- `GET /enrollment/students` - Get enrolled students (Protected: mess_admin)

#### Attendance (`/attendance`)
- `POST /attendance/mark` - Mark attendance (Protected: mess_admin)
- `GET /attendance/my` - Get student attendance (Protected: student)
- `GET /attendance/students` - Get all students' attendance (Protected: mess_admin)

#### Menu (`/menu`)
- `GET /menu/my` - Get admin's mess menu (Protected: mess_admin)
- `POST /menu/my` - Save/update menu (Protected: mess_admin)
- `GET /menu/all` - Get all mess menus (Protected: student)

#### Notice (`/notice`)
- `POST /notice/create` - Create notice (Protected: mess_admin)
- `GET /notice/my-mess` - Get mess notices (Protected: mess_admin)
- `GET /notice/student` - Get student's mess notices (Protected: student)

---

## Database Schema Overview

### Core Tables

#### `users`
- Stores all user accounts (students, mess admins, super admins)
- Fields: `id`, `name`, `email`, `password_hash`, `role`, `phone`, `address`, `aadhar_number`, `gst_number`, `security_question`, `security_answer_hash`, `created_at`

#### `messes`
- Stores mess/hostel information
- Fields: `id`, `name`, `description`, `location`, `admin_id` (FK to users), `status` (pending/approved/rejected), `created_at`
- Relationship: One admin can create multiple messes

#### `student_mess_enrollments`
- Manages student enrollment in messes
- Fields: `id`, `student_id` (FK to users), `mess_id` (FK to messes), `status` (pending/approved/rejected), `is_current` (boolean), `created_at`
- Relationship: Many-to-many between students and messes

#### `attendance`
- Tracks daily attendance of students
- Fields: `id`, `student_id` (FK to users), `mess_id` (FK to messes), `date`, `status` (present/absent), `marked_by` (FK to users)

#### `menus`
- Stores daily menu items for messes
- Fields: `id`, `mess_id` (FK to messes), `day_of_week`, `breakfast`, `lunch`, `dinner`, `created_at`, `updated_at`

#### `notices`
- Stores notices/announcements from mess admins
- Fields: `id`, `mess_id` (FK to messes), `title`, `content`, `created_by` (FK to users), `created_at`

---

## User Roles & Permissions

### 1. Student (`student`)
**Permissions:**
- Register and login
- View all approved messes
- Request enrollment in a mess
- View own enrollment status
- View own attendance records
- View mess menu
- View notices from enrolled mess
- Change password
- Recover password

**Access:**
- `/student-dashboard`
- `/student-notices`

### 2. Mess Administrator (`mess_admin`)
**Permissions:**
- Register and login
- Create new mess (pending status)
- View own messes
- Delete own messes
- View pending enrollment requests for own mess
- Approve/reject student enrollment requests
- View enrolled students
- Mark attendance for enrolled students
- View attendance records
- Create and update mess menu
- Create notices for own mess
- View notices for own mess
- Change password
- Recover password

**Access:**
- `/admin-dashboard`

### 3. Super Administrator (`super_admin`)
**Permissions:**
- All mess admin permissions
- View all pending mess requests
- Approve/reject mess requests
- View all messes (all statuses)
- View detailed mess information with admin details

**Access:**
- `/super-admin-dashboard`

---

## Key User Flows

### Flow 1: Student Enrollment Process

```
1. Student registers account
   ↓
2. Student logs in
   ↓
3. Student views available messes (GET /mess/all)
   ↓
4. Student selects a mess and requests enrollment (POST /enrollment/request/:messId)
   ↓
5. Enrollment request created with 'pending' status
   ↓
6. Mess Admin views pending requests (GET /enrollment/pending)
   ↓
7. Admin approves/rejects request (PUT /enrollment/:id/approve)
   ↓
8. Student's enrollment status updated
   ↓
9. Student can now access mess features (menu, attendance, notices)
```

### Flow 2: Mess Creation & Approval Process

```
1. Mess Admin registers account
   ↓
2. Admin logs in
   ↓
3. Admin creates mess (POST /mess/create)
   ↓
4. Mess created with 'pending' status
   ↓
5. Super Admin views pending messes (GET /mess/pending)
   ↓
6. Super Admin reviews mess details
   ↓
7. Super Admin approves/rejects mess (PUT /mess/:id/approve)
   ↓
8. Mess status updated to 'approved'
   ↓
9. Mess now visible to students (GET /mess/all returns it)
```

### Flow 3: Attendance Tracking Flow

```
1. Mess Admin logs in
   ↓
2. Admin views enrolled students
   ↓
3. Admin marks daily attendance (POST /attendance/mark)
   ├── Student ID
   ├── Date
   └── Status (present/absent)
   ↓
4. Attendance record saved to database
   ↓
5. Student can view own attendance (GET /attendance/my)
   ↓
6. Admin can view all attendance records (GET /attendance/students)
```

### Flow 4: Menu Management Flow

```
1. Mess Admin logs in
   ↓
2. Admin views/edits menu (GET /menu/my)
   ↓
3. Admin updates menu items (POST /menu/my)
   ├── Day of week
   ├── Breakfast items
   ├── Lunch items
   └── Dinner items
   ↓
4. Menu saved to database
   ↓
5. Students view mess menu (GET /menu/all)
```

### Flow 5: Notice Distribution Flow

```
1. Mess Admin logs in
   ↓
2. Admin creates notice (POST /notice/create)
   ├── Title
   ├── Content
   └── Mess ID (implicit)
   ↓
3. Notice saved to database
   ↓
4. Students enrolled in mess can view notices (GET /notice/student)
   ↓
5. Admin can view all notices for own mess (GET /notice/my-mess)
```

---

## Security Architecture

### Authentication Mechanism
- **JWT (JSON Web Tokens)**: Used for stateless authentication
- **Token Storage**: Stored in browser's localStorage
- **Token Format**: `Bearer <token>` in Authorization header
- **Password Security**: bcrypt hashing with salt rounds

### Authorization
- **Role-Based Access Control (RBAC)**: Three roles with different permissions
- **Route Protection**: 
  - Frontend: `ProtectedRoute` component checks localStorage
  - Backend: `verifyToken` middleware validates JWT on protected routes
- **Permission Checks**: Controllers verify user role for specific actions

### Security Measures
1. **Password Hashing**: All passwords hashed with bcrypt before storage
2. **JWT Tokens**: Secure token-based authentication
3. **CORS**: Cross-origin resource sharing configured
4. **Input Validation**: Performed in controllers
5. **SQL Injection Prevention**: Parameterized queries via mysql2
6. **Security Questions**: Used for password recovery

### API Security Flow
```
Request → CORS Check → JSON Parser → JWT Verification (if protected)
→ Role Check (if required) → Controller Logic → Response
```

---

## Deployment Architecture

### Development Environment
```
Frontend: React Development Server (port 3000)
Backend: Node.js/Express Server (port 5000)
Database: Local MySQL instance
```

### Production Considerations
- Frontend: Build static files, serve via Nginx/Apache or CDN
- Backend: Node.js process manager (PM2) or containerized (Docker)
- Database: MySQL server (can be on same or separate server)
- Environment Variables: Secure storage of DB credentials, JWT secret
- HTTPS: SSL/TLS certificates for secure communication

---

## Conclusion

This Mess Platform follows a modern, scalable architecture with clear separation of concerns:
- **Frontend**: React-based SPA with component-based structure
- **Backend**: RESTful API with Express.js following MVC pattern
- **Database**: Relational MySQL database with normalized schema
- **Security**: JWT-based authentication with role-based authorization

The system is designed to handle multiple messes, students, and administrators with proper access controls and data integrity.



