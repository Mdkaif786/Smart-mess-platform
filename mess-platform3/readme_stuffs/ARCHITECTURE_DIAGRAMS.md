# Mess Platform - Visual Architecture Diagrams

This document contains visual diagrams that complement the main SYSTEM_ARCHITECTURE.md file.

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>Port 3000]
        A1[Pages/Components]
        A2[React Router]
        A3[Axios HTTP Client]
        A --> A1
        A1 --> A2
        A2 --> A3
    end

    subgraph "Application Layer"
        B[Express.js Backend<br/>Port 5000]
        B1[Routes]
        B2[Controllers]
        B3[Models]
        B4[Middleware]
        B --> B1
        B1 --> B4
        B4 --> B2
        B2 --> B3
    end

    subgraph "Data Layer"
        C[(MySQL Database)]
        C1[(users)]
        C2[(messes)]
        C3[(enrollments)]
        C4[(attendance)]
        C5[(menus)]
        C6[(notices)]
        C --> C1
        C --> C2
        C --> C3
        C --> C4
        C --> C5
        C --> C6
    end

    A3 -->|HTTPS/REST API| B
    B3 -->|SQL Queries| C

    style A fill:#61dafb
    style B fill:#68a063
    style C fill:#00758f
```

## 2. Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant D as Database

    Note over U,D: Registration Flow
    U->>F: Fill registration form
    F->>B: POST /auth/register
    B->>D: Hash password, Insert user
    D-->>B: User created
    B-->>F: Success response
    F-->>U: Registration successful

    Note over U,D: Login Flow
    U->>F: Enter credentials
    F->>B: POST /auth/login
    B->>D: Verify credentials
    D-->>B: User data
    B->>B: Generate JWT token
    B-->>F: Token + user data
    F->>F: Store token in localStorage
    F-->>U: Redirect to dashboard

    Note over U,D: Protected Route Access
    U->>F: Access protected page
    F->>F: Get token from localStorage
    F->>B: GET /api/endpoint<br/>(Authorization: Bearer token)
    B->>B: Verify JWT token
    B->>D: Execute query
    D-->>B: Data
    B-->>F: JSON response
    F-->>U: Render data
```

## 3. Student Enrollment Flow

```mermaid
sequenceDiagram
    participant S as Student
    participant F as Frontend
    participant B as Backend
    participant D as Database
    participant A as Mess Admin

    S->>F: Browse available messes
    F->>B: GET /mess/all
    B->>D: Query approved messes
    D-->>B: Mess list
    B-->>F: Mess data
    F-->>S: Display messes

    S->>F: Request enrollment
    F->>B: POST /enrollment/request/:messId
    B->>D: Create enrollment (pending)
    D-->>B: Enrollment created
    B-->>F: Success
    F-->>S: Request submitted

    A->>F: View pending requests
    F->>B: GET /enrollment/pending
    B->>D: Query pending enrollments
    D-->>B: Pending list
    B-->>F: Requests data
    F-->>A: Display requests

    A->>F: Approve request
    F->>B: PUT /enrollment/:id/approve
    B->>D: Update status to 'approved'
    D-->>B: Updated
    B-->>F: Success
    F-->>A: Request approved

    S->>F: Check enrollment status
    F->>B: GET /enrollment/my
    B->>D: Query student enrollment
    D-->>B: Enrollment data
    B-->>F: Status: approved
    F-->>S: Enrollment confirmed
```

## 4. Mess Creation & Approval Flow

```mermaid
sequenceDiagram
    participant MA as Mess Admin
    participant F as Frontend
    participant B as Backend
    participant D as Database
    participant SA as Super Admin

    MA->>F: Create new mess
    F->>B: POST /mess/create
    B->>D: Insert mess (status: pending)
    D-->>B: Mess created
    B-->>F: Success
    F-->>MA: Mess created (pending)

    SA->>F: View pending messes
    F->>B: GET /mess/pending
    B->>D: Query pending messes with admin info
    D-->>B: Pending messes
    B-->>F: Mess data
    F-->>SA: Display pending messes

    SA->>F: Review mess details
    F->>B: GET /mess/:id (details)
    B->>D: Query mess + admin details
    D-->>B: Full details
    B-->>F: Mess information
    F-->>SA: Display details

    SA->>F: Approve mess
    F->>B: PUT /mess/:id/approve
    B->>D: Update status to 'approved'
    D-->>B: Updated
    B-->>F: Success
    F-->>SA: Mess approved

    Note over F,D: Mess now visible to students
```

## 5. Data Model Relationships

```mermaid
erDiagram
    users ||--o{ messes : "creates"
    users ||--o{ student_mess_enrollments : "enrolls"
    messes ||--o{ student_mess_enrollments : "has"
    users ||--o{ attendance : "marked_for"
    messes ||--o{ attendance : "tracks"
    messes ||--o{ menus : "has"
    messes ||--o{ notices : "publishes"
    users ||--o{ notices : "creates"

    users {
        int id PK
        string name
        string email
        string password_hash
        string role
        string phone
        string address
        string aadhar_number
        string gst_number
        string security_question
        string security_answer_hash
        datetime created_at
    }

    messes {
        int id PK
        string name
        string description
        string location
        int admin_id FK
        string status
        datetime created_at
    }

    student_mess_enrollments {
        int id PK
        int student_id FK
        int mess_id FK
        string status
        boolean is_current
        datetime created_at
    }

    attendance {
        int id PK
        int student_id FK
        int mess_id FK
        date date
        string status
        int marked_by FK
    }

    menus {
        int id PK
        int mess_id FK
        string day_of_week
        string breakfast
        string lunch
        string dinner
        datetime created_at
        datetime updated_at
    }

    notices {
        int id PK
        int mess_id FK
        string title
        text content
        int created_by FK
        datetime created_at
    }
```

## 6. Request-Response Cycle

```mermaid
graph LR
    A[User Action] --> B[React Component]
    B --> C[Event Handler]
    C --> D[Axios Request]
    D --> E[Express Server]
    E --> F[CORS Middleware]
    F --> G[JSON Parser]
    G --> H{JWT Required?}
    H -->|Yes| I[JWT Verification]
    H -->|No| J[Route Handler]
    I -->|Valid| J
    I -->|Invalid| K[401 Unauthorized]
    J --> L[Controller]
    L --> M[Model/DB Query]
    M --> N[(MySQL)]
    N --> O[Results]
    O --> P[Controller Logic]
    P --> Q[JSON Response]
    Q --> R[Axios Response]
    R --> S[State Update]
    S --> T[UI Re-render]
    
    style A fill:#ff9999
    style T fill:#99ff99
    style K fill:#ff6666
```

## 7. Role-Based Access Control

```mermaid
graph TD
    A[User Login] --> B{Check Role}
    B -->|student| C[Student Dashboard]
    B -->|mess_admin| D[Admin Dashboard]
    B -->|super_admin| E[Super Admin Dashboard]

    C --> C1[View Messes]
    C --> C2[Request Enrollment]
    C --> C3[View Attendance]
    C --> C4[View Menu]
    C --> C5[View Notices]

    D --> D1[Create Mess]
    D --> D2[Manage Enrollments]
    D --> D3[Mark Attendance]
    D --> D4[Manage Menu]
    D --> D5[Create Notices]

    E --> E1[All Admin Features]
    E --> E2[Approve Messes]
    E --> E3[View All Messes]
    E --> E4[System Overview]

    style C fill:#e1f5ff
    style D fill:#fff4e1
    style E fill:#ffe1f5
```

## 8. Component Hierarchy (Frontend)

```mermaid
graph TD
    A[App.js] --> B[Router]
    B --> C[Navbar]
    B --> D[Routes]
    
    D --> E[Public Routes]
    D --> F[Protected Routes]
    
    E --> E1[Home]
    E --> E2[Login]
    E --> E3[Register]
    E --> E4[ForgotPassword]
    
    F --> F1[ProtectedRoute]
    F1 --> F2[StudentDashboard]
    F1 --> F3[AdminDashboard]
    F1 --> F4[SuperAdminDashboard]
    
    F2 --> G1[StudentHome]
    F2 --> G2[ExploreMesses]
    F2 --> G3[AttendanceCalendar]
    F2 --> G4[StudentMessMenu]
    
    F3 --> H1[DashboardHome]
    F3 --> H2[ManageMess]
    F3 --> H3[MessMenu]
    F3 --> H4[EnrolledStudents]
    
    F4 --> I1[PendingMessList]
    F4 --> I2[AllMessesTable]
    F4 --> I3[MessDetailModal]

    style A fill:#61dafb
    style F1 fill:#ffd700
```

## 9. Backend Request Processing

```mermaid
graph TD
    A[HTTP Request] --> B[Express App]
    B --> C[CORS Check]
    C --> D[Body Parser]
    D --> E{Route Match}
    
    E --> F[/auth/*]
    E --> G[/mess/*]
    E --> H[/enrollment/*]
    E --> I[/attendance/*]
    E --> J[/menu/*]
    E --> K[/notice/*]
    
    F --> L[Auth Routes]
    G --> M[Mess Routes]
    H --> N[Enrollment Routes]
    I --> O[Attendance Routes]
    J --> P[Menu Routes]
    K --> Q[Notice Routes]
    
    L --> R{Protected?}
    M --> R
    N --> R
    O --> R
    P --> R
    Q --> R
    
    R -->|Yes| S[JWT Middleware]
    R -->|No| T[Controller]
    S -->|Valid| T
    S -->|Invalid| U[401 Error]
    
    T --> V[Business Logic]
    V --> W[Model Layer]
    W --> X[Database Query]
    X --> Y[Response]
    Y --> Z[JSON Response]

    style R fill:#ffd700
    style S fill:#ff9999
    style Y fill:#99ff99
```

## 10. Complete User Journey: Student

```mermaid
journey
    title Student User Journey
    section Registration
      Register Account: 5: Student
      Verify Email: 3: Student
    section Login
      Login: 5: Student
    section Explore
      Browse Messes: 4: Student
      View Mess Details: 4: Student
    section Enrollment
      Request Enrollment: 5: Student
      Wait for Approval: 2: Student
      Enrollment Approved: 5: Student
    section Daily Usage
      View Menu: 5: Student
      Check Attendance: 4: Student
      Read Notices: 4: Student
    section Account Management
      Change Password: 3: Student
      Logout: 5: Student
```

---

## How to Use These Diagrams

These Mermaid diagrams can be rendered in:
- GitHub (automatically)
- GitLab (automatically)
- Markdown viewers with Mermaid support
- VS Code with Mermaid extensions
- Online Mermaid editors (https://mermaid.live)

To view the diagrams, simply open this file in any of the above platforms, and the diagrams will render automatically.



