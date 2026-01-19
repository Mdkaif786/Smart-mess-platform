# 🎯 ONE-PAGE CHEAT SHEET - Read This Right Before Interview!

## 📋 PROJECT IN ONE SENTENCE
**Mess Management Platform**: Web app for managing hostel/mess dining with student enrollment, attendance tracking, menu management, and notices.

---

## 🏗️ ARCHITECTURE (3-Tier)
```
React Frontend (Port 3000) → HTTP Requests → Express Backend (Port 5000) → MySQL Database
```

---

## 👥 3 USER ROLES
1. **Student**: Browse messes, enroll, view menu/attendance/notices
2. **Mess Admin**: Create mess, approve enrollments, mark attendance, manage menu
3. **Super Admin**: Approve mess registrations, oversee everything

---

## 🔐 AUTHENTICATION (JWT)
1. User logs in → Backend verifies password → Creates JWT token (contains user ID + role)
2. Token saved in localStorage (frontend)
3. Token sent with every request in `Authorization: Bearer <token>` header
4. Backend middleware verifies token before allowing access

---

## 📂 KEY FILES

### Backend:
- `server.js` - Starts server
- `app.js` - Routes setup
- `routes/` - URL definitions
- `controllers/` - Business logic
- `models/` - Database queries
- `middlewares/auth.middleware.js` - JWT verification

### Frontend:
- `App.js` - Routing setup
- `pages/Login.js` - Login form
- `components/ProtectedRoute.js` - Route guard
- Uses `localStorage` for token storage

---

## 🔄 KEY FLOWS

### Login:
User enters credentials → POST `/auth/login` → Backend verifies → Returns JWT token → Frontend saves token → Redirects to dashboard

### Student Enrollment:
Student requests enrollment → Status: "pending" → Admin approves → Status: "approved" → Student gets access

### Mess Creation:
Admin creates mess → Status: "pending" → Super Admin approves → Mess visible to students

---

## 💾 DATABASE (Main Tables)
- `users` - User accounts
- `messes` - Mess information
- `student_mess_enrollments` - Enrollment records
- `attendance` - Daily attendance
- `menus` - Menu items
- `notices` - Announcements

---

## 🎤 QUICK ANSWERS

**Q: What technologies?**
A: React (frontend), Node.js/Express (backend), MySQL (database), JWT (auth)

**Q: How does auth work?**
A: User logs in → Backend creates JWT token → Token stored in localStorage → Sent with every request → Backend verifies token

**Q: How frontend talks to backend?**
A: HTTP REST API calls using Axios library

**Q: What security?**
A: Password hashing (bcrypt), JWT tokens, Role-based access control, Protected routes

---

## ✅ REMEMBER
- **Be confident** - You built this!
- **Explain simply** - Don't overcomplicate
- **Use examples** - "It's like..."
- **Admit when unsure** - Shows honesty and willingness to learn

**YOU'VE GOT THIS! 🚀**


