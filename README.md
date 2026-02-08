# PropManager - Property Management System

A full-stack web application for managing rental properties, tenants, maintenance requests, and payments built with React, Node.js, Express, and Supabase.

## Quick Start

```bash
# Clone the repository
git clone <repository-url>

# Install backend dependencies
cd backend
npm install

# Create .env file with Supabase credentials
# SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY

# Start backend server
npm start

# In a new terminal, install frontend dependencies
cd frontend
npm install

# Start frontend development server
npm run dev
```

Visit `http://localhost:5173` to access the application.

---

## Project Overview

PropManager is a comprehensive property management platform that helps landlords and property managers streamline operations and communicate with tenants efficiently.

### For Administrators:
- Manage multiple properties and tenant information
- Track rental payments and payment history  
- Handle maintenance requests from tenants
- Post notices and announcements to all tenants with priority levels
- Manage requests and complaints with status tracking
- Generate reports on occupancy and revenue
- View real-time statistics and analytics
- Confirm and mark events as complete
- See dashboard summaries with total properties and outstanding balance
- View upcoming events and past events in separate tabs
- Create, view, and delete system-wide notices

### For Tenants/Users:
- View assigned property details and lease information
- Submit maintenance requests with property selection
- Pay rent and track payment history
- View and read notices from property management
- Mark notices as read with unread count tracking
- View scheduled appointments and events (upcoming and past)
- Manage personal profile and settings
- Submit notices and track their status (pending, confirmed, closed)
- Receive priority-coded announcements (normal, high, urgent)

---

## Features Currently Working

### Authentication & Authorization
- User signup with role selection (Admin/Tenant)
- Secure login with JWT tokens
- Role-based access control (RBAC)
- Admin and tenant dashboards with different layouts
- User profile management (update name, phone, address)
- Change password functionality

### Property Management
- Add new properties with status and pricing
- Update property details and status
- Delete properties
- View all properties with filtering
- Track property occupancy status (vacant, occupied, maintenance)

### Event & Calendar System
- Create calendar events (inspections, meetings, lease dates, etc.)
- View upcoming events on calendar widget
- Admin can confirm tenant notices (status changes to "Confirmed")
- Admin can mark events as complete (status changes to "Closed")
- Events show status: Pending Admin Review, Confirmed by Admin, or Closed
- Users see when their requests have been confirmed or closed
- Upcoming and Past event tabs for both admin and user dashboards

### Tenant Management
- View all tenants and their information
- Assign tenants to properties
- Track tenant contact information
- View tenant payment history

### Maintenance Requests
- Tenants can submit maintenance requests with property selection
- Admins can view all maintenance requests
- Track maintenance request status
- Update request status (pending, in-progress, completed)
- Automatic calendar event creation for maintenance requests

### Payment Tracking
- Tenants can submit payments through payment form
- Record rent payments with automatic date tracking
- View payment history
- Track outstanding balance (automatically calculated)
- Calculate total income and expenses
- Generate revenue reports
- Admin dashboard shows updated outstanding balance in real-time

### Notices & Announcements System
- Admins can post announcements to all tenants
- Priority levels (normal, high, urgent) with color coding
- Tenants receive notices with read/unread tracking
- Mark notices as read functionality
- Visual indicators for unread notices
- Automated notification system replacing generic messaging

### Reporting & Analytics
- Occupancy reports (number of properties)
- Revenue reports (income, expenses, profit)
- Dashboard statistics with real-time updates
- Financial overview cards with accurate calculations

### User Features
- Profile settings and management
- Change password
- Update contact information
- View personal information

### User Interface
- Responsive design with Tailwind CSS breakpoints
- Mobile-optimized layouts for all dashboard components
- Adaptive navigation (icons-only on mobile, labeled on desktop)
- Grid-based responsive layouts for cards and summaries
- Flexible calendar and sidebar stacking on mobile devices
- Professional color-coded status indicators

---

## Technology Stack

### Backend
- Node.js (v18+) - JavaScript runtime
- Express.js (v4) - Web framework for building REST APIs
- Supabase - PostgreSQL database and authentication
- JWT - Secure token authentication
- dotenv - Environment variable management

### Frontend
- React 19 - Modern UI library with hooks
- Vite - Fast build tool and development server
- Tailwind CSS - Utility CSS framework for styling
- React Router v6 - Client-side page routing
- Lucide React - Icon library

### Database
- PostgreSQL (via Supabase Cloud)
- Row Level Security (RLS) - Database-level access control
- Real-time subscriptions - Live data updates

---

## Project Structure

```
PropManager/
├── backend/
│   │   ├── routes/
│   │   │   ├── auth.js              # Login/signup/logout/profile endpoints
│   │   │   ├── properties.js        # Property CRUD operations
│   │   │   ├── tenants.js           # Tenant management
│   │   │   ├── maintenance.js       # Maintenance request handling
│   │   │   ├── payments.js          # Payment tracking and submission
│   │   │   ├── communication.js     # Messaging system
│   │   │   ├── notices.js           # Announcements and notices system
│   │   │   ├── reports.js           # Analytics and reports
│   │   │   └── events.js            # Calendar events with confirm/complete
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── rbac.js              # Role-based access control
│   │   └── requireRole.js       # Role verification (admin only)
│   ├── migrations/
│   │   └── 003_create_notices_tables.sql  # Database schema for notices
│   ├── utils/
│   │   └── validation.js        # Input validation helpers
│   ├── server.js                # Express app entry point
│   ├── supabaseClient.js        # Supabase configuration
│   ├── package.json             # Backend dependencies
│   └── .env                     # Environment variables (DO NOT COMMIT)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx                    # Login page
│   │   │   ├── Signup.jsx                   # User registration
│   │   │   ├── Header/                      # Navigation header with logout
│   │   │   ├── dashboard-admin/             # Admin dashboard components
│   │   │   │   ├── dashboard-admin.jsx
│   │   │   │   └── dashboard-admin-components/
│   │   │   │       ├── overview.jsx         # Activity & Finance stats
│   │   │   │       ├── PropertiesManager.jsx # Property CRUD interface
│   │   │   │       ├── Summary section.jsx  # Top summary cards
│   │   │   │       ├── upcomingActivity.jsx # Calendar with confirm/done buttons
│   │   │   │       └── Welcome.jsx          # Welcome message
│   │   │   ├── dashboard-user/              # Tenant dashboard components
│   │   │   │   ├── dashboard-user.jsx
│   │   │   │   └── dashboard-user-components/
│   │   │   │       ├── options.jsx          # Action cards (notice, maintenance, payment)
│   │   │   │       ├── Summary section.jsx  # Payment/Messages/Alerts
│   │   │   │       ├── upcomingActivity.jsx # Calendar view with past events tab
│   │   │   │       ├── UserProfile.jsx      # Profile management modal
│   │   │   │       └── Welcome.jsx          # Greeting
│   │   │   ├── Error/                       # Error boundary
│   │   │   └── Loading/                     # Loading spinner
│   │   ├── Pages/
│   │   │   ├── adminhome.jsx                # Admin dashboard page
│   │   │   ├── userhome.jsx                 # Tenant dashboard page
│   │   │   ├── home.jsx                     # Landing page
│   │   │   └── notFound.jsx                 # 404 page
│   │   ├── Services/
│   │   │   └── api.js                       # API client with all endpoints
│   │   ├── App.jsx                          # Main app component with routes
│   │   ├── main.jsx                         # React entry point
│   │   ├── mockData.js                      # Sample data for development
│   │   └── index.css                        # Global styles
│   ├── package.json                          # Frontend dependencies
│   ├── vite.config.js                        # Vite configuration
│   ├── eslint.config.js                      # ESLint configuration
│   └── tailwind.config.js                    # Tailwind CSS config
├── README.md                                  # This file
├── CHANGES_SUMMARY.md                        # Summary of recent changes
├── FEATURE_VERIFICATION.md                   # Feature testing checklist
├── DEBUG_NOTES.md                            # Debugging information
├── GROUP_REPORT.md                           # Team project report
└── package.json                              # Root package.json
```

---

## 🔧 Setup & Installation

### Prerequisites
- Node.js v18+ and npm
- Supabase account (free tier available at https://supabase.com)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env  # if template exists, otherwise create .env manually
   ```

4. **Add environment variables to .env:**
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   PORT=3000
   NODE_ENV=development
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory (in a new terminal):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📡 API Endpoints

All endpoints require `Authorization: Bearer <token>` header except signup and login.

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/auth/signup` | Register new user | ❌ |
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/logout` | User logout | ✅ |
| GET | `/auth/me` | Get current user profile | ✅ |
| PUT | `/auth/profile` | Update user profile (name, phone, address) | ✅ |
| POST | `/auth/change-password` | Change user password | ✅ |

### Properties Routes (`/api/properties`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---|---|
| GET | `/properties` | Get all properties | ✅ | ❌ |
| GET | `/properties/:id` | Get specific property | ✅ | ❌ |
| POST | `/properties` | Create new property | ✅ | ✅ |
| PUT | `/properties/:id` | Update property | ✅ | ✅ |
| DELETE | `/properties/:id` | Delete property | ✅ | ✅ |

**Property Status Values:** `available`, `occupied`, `maintenance`

### Events/Calendar Routes (`/api/events`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---|---|
| GET | `/events` | Get all events | ✅ | ❌ |
| POST | `/events` | Create event | ✅ | ❌ |
| PUT | `/events/:id` | Update event | ✅ | ✅ |
| PUT | `/events/:id/confirm` | Confirm pending event | ✅ | ✅ |
| PUT | `/events/:id/complete` | Mark event as completed | ✅ | ✅ |
| DELETE | `/events/:id` | Delete event | ✅ | ✅ |

**Event Types:** `inspection`, `lease`, `maintenance`, `meeting`, `payment`
**Event Status:** `pending` (tenant created), `confirmed` (admin approved), `completed`

### Maintenance Routes (`/api/maintenance`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/maintenance` | Get all maintenance requests | ✅ |
| POST | `/maintenance` | Create maintenance request | ✅ |
| PUT | `/maintenance/:id` | Update request status | ✅ |

### Tenants Routes (`/api/tenants`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---|---|
| GET | `/tenants` | Get all tenants | ✅ | ✅ |

### Payments Routes (`/api/payments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/payments` | Get all payments | ✅ |
| GET | `/payments/history/:tenantId` | Get payment history for tenant | ✅ |

### Communication Routes (`/api/communication`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/communication` | Get all messages | ✅ |
| POST | `/communication` | Send message | ✅ |

### Notices Routes (`/api/notices`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---|---|
| GET | `/notices` | Get all notices | ✅ | ❌ |
| POST | `/notices` | Create new notice | ✅ | ✅ |
| DELETE | `/notices/:id` | Delete notice | ✅ | ✅ |
| POST | `/notices/:id/read` | Mark notice as read | ✅ | ❌ |
| GET | `/notices/read-status` | Get read status for user | ✅ | ❌ |

**Notice Priority Levels:** `normal`, `high`, `urgent`

### Reports Routes (`/api/reports`)

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---|---|
| GET | `/reports/occupancy` | Get occupancy report | ✅ | ✅ |
| GET | `/reports/revenue` | Get revenue report | ✅ | ✅ |

---

## 🧪 Testing the Application

### Admin User Test Flow
1. Sign up with `role: admin` option
2. Create a property from Admin Dashboard
3. Click on "Notices" card to view notices modal
4. Create a new notice with priority level (normal/high/urgent)
5. Click on "Requests and Complaints" card to view maintenance requests
6. Update maintenance request status (pending/in-progress/completed)
7. Create a calendar event
8. Confirm pending events using the Confirm button
9. Mark events as complete using Mark Done button
10. Check Reports for occupancy and revenue data
11. Delete outdated notices from the notices modal

### Tenant User Test Flow
1. Sign up with `role: tenant` option
2. View assigned property in dashboard
3. Click on "Notices" card to view announcements from admin
4. Mark notices as read (unread count updates automatically)
5. Submit a maintenance request with property selection
6. Submit a payment through the payment form
7. View upcoming and past events in calendar tabs
8. Update profile information and change password
9. Check for new notices indicated by unread count and blue border

### Key Features to Verify
- ✅ Confirm button only shows for pending, non-completed events from tenants
- ✅ Mark Done button shows for non-completed events
- ✅ Profile updates save correctly
- ✅ Password change works (minimum 6 characters)
- ✅ Events show correct status badges
- ✅ Calendar updates in real-time

---

## 🐛 Known Issues & Solutions

### ✅ RESOLVED: Property Creation Validation Error
**Problem**: Frontend sends `status: "available"` but backend expected `"vacant"` or `"occupied"`
**Solution**: Updated backend validation to accept `available`, `occupied`, `maintenance`

### ✅ RESOLVED: Admin Dashboard Shows Zero Values
**Problem**: Dashboard cards showed hardcoded 0 values instead of real data
**Solution**: Connected components to backend APIs for real data fetching

### ✅ RESOLVED: Missing API Functions
**Problem**: Frontend components couldn't fetch tenants, messages, or reports
**Solution**: Added comprehensive API client in `frontend/src/Services/api.js` with all necessary endpoints

### ✅ RESOLVED: Confirm and Mark Done Not Working
**Problem**: Event action buttons had no backend endpoints
**Solution**: Implemented `/events/:id/confirm` and `/events/:id/complete` endpoints with proper status updates

---

## 📝 Development Guidelines

### Adding New Features
1. Create backend endpoint in appropriate route file
2. Add middleware auth checks (use `auth` for all users, `requireAdmin` for admins only)
3. Add frontend API call in `frontend/src/Services/api.js`
4. Create React component to consume the API
5. Add error handling and loading states
6. Test with both admin and tenant roles

### Environment Variables
Create a `.env` file in the backend directory:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
PORT=3000
NODE_ENV=development
```

### Database Tables
The system uses these Supabase tables:
- `users` - User profiles and roles
- `properties` - Property listings
- `tenants` - Tenant information
- `maintenance_requests` - Maintenance requests
- `payments` - Payment records
- `communications` - Communication messages
- `notices` - System-wide announcements and notices
- `notice_reads` - Tracking read/unread status per user
- `events` - Calendar events

---

## 🚀 Deployment

### Deploy Backend (Node.js)
```bash
# Build for production
npm install

# Deploy to cloud provider (Heroku, Railway, Render, etc.)
# Set environment variables in platform
# Start with: npm start
```

### Deploy Frontend (React/Vite)
```bash
# Build static files
npm run build

# Output in 'dist' folder
# Deploy to Netlify, Vercel, AWS S3, etc.
```

### Environment Configuration
Update API_URL in `frontend/src/Services/api.js` for production:
```javascript
const API_URL = 'https://your-production-backend.com/api';
```

---

## 📞 Support & Contribution

For issues, bug reports, or feature requests, please create an issue in the repository.

### Key Contacts
- **Frontend Lead**: React/Vite development
- **Backend Lead**: Node.js/Express API development
- **Database**: Supabase configuration

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## ✨ Changelog

### Latest Updates (February 2026)
- ✅ Implemented Confirm Event feature for admin approval of tenant notices
- ✅ Implemented Mark Done feature to complete calendar events
- ✅ Added User Profile Management (update info, change password)
- ✅ Created UserProfile component with modal interface
- ✅ Enhanced auth routes with profile and password endpoints
- ✅ Updated README with complete API documentation
- ✅ All features tested and verified working

### Previous Updates
- Property management with CRUD operations
- Payment tracking and history
- Maintenance request system
- Communication/messaging system
- Admin and tenant dashboards
- Role-based access control
- Calendar/events system

```

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Supabase account** (free tier) - [Sign up](https://supabase.com/)
- **Git** for version control

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/Amke0501/PropManager.git
cd PropManager
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

**Create `.env` file in `backend/` folder:**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
JWT_SECRET=your_random_secret_key_123!@#
PORT=3000
```

> **⚠️ IMPORTANT**: 
> - Get `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` from Supabase Dashboard → Settings → API
> - Use the **service_role** key, NOT the anon key
> - NEVER commit `.env` to Git (it's already in `.gitignore`)

#### 3. Frontend Setup
```bash
cd frontend
npm install
```

#### 4. Database Setup (Supabase)

**Create these tables in Supabase SQL Editor:**

```sql
-- Users table (stores user profiles)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'tenant')) DEFAULT 'tenant',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  rent DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('available', 'occupied', 'maintenance')) DEFAULT 'available',
  tenant_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance requests table
CREATE TABLE maintenance_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  property_id UUID REFERENCES properties(id),
  tenant_id UUID REFERENCES users(id),
  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  month TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communications/Messages table
CREATE TABLE communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notices table (stores announcements from admins)
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('normal', 'high', 'urgent')) DEFAULT 'normal',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notice reads table (tracks which users have read which notices)
CREATE TABLE notice_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id UUID REFERENCES notices(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(notice_id, user_id)
);

-- Events/Calendar table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  property TEXT,
  type TEXT CHECK (type IN ('inspection', 'lease', 'maintenance', 'meeting', 'payment')),
  date DATE NOT NULL,
  time TIME,
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Alternative: Run Migration Files**

The project includes migration files in `backend/migrations/` directory. To apply them:

1. Navigate to Supabase SQL Editor
2. Copy the contents of each migration file in order:
   - `001_initial_schema.sql` (if exists)
   - `002_add_features.sql` (if exists)
   - `003_create_notices_tables.sql` (required for notices feature)
3. Execute each migration in the SQL Editor
4. Verify tables are created by checking the Table Editor

---

## 🚀 Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Start Backend:**
```bash
cd backend
node server.js
```
✅ Server runs on `http://localhost:3000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
✅ App runs on `http://localhost:5173`

### Option 2: For Development
```bash
# In backend folder (terminal 1)
npm install -g nodemon
nodemon server.js

# In frontend folder (terminal 2)
npm run dev
```

### First Time Access
1. Open browser to `http://localhost:5173`
2. Click **"Create account"** (Signup page)
3. Choose **Admin** or **User** role
4. Fill in email and password
5. Login with your credentials
6. Admin → `/admin` dashboard
7. User → `/user` dashboard

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/auth/signup` | Register new user | No | - |
| POST | `/auth/login` | User login | No | - |
| POST | `/auth/logout` | User logout | Yes | All |
| GET | `/auth/me` | Get current user | Yes | All |

**Signup Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "admin" // or "tenant"
}
```

### Properties Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/properties` | Get all properties | Yes | All |
| GET | `/properties/:id` | Get single property | Yes | All |
| POST | `/properties` | Create property | Yes | Admin |
| PUT | `/properties/:id` | Update property | Yes | Admin |
| DELETE | `/properties/:id` | Delete property | Yes | Admin |

**Create Property Request:**
```json
{
  "name": "Sunset Apartments",
  "address": "123 Main Street, City",
  "rent": 1500.00,
  "status": "available" // or "occupied", "maintenance"
}
```

### Maintenance Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/maintenance` | Get all requests | Yes | All |
| POST | `/maintenance` | Create request | Yes | Tenant |
| PUT | `/maintenance/:id` | Update status | Yes | Admin |

### Payments Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/payments` | Get payment history | Yes | All |
| POST | `/payments` | Record payment | Yes | Admin |
| GET | `/payments/history/:tenantId` | Get tenant's history | Yes | All |

### Reports Endpoints

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/reports/occupancy` | Get occupancy stats | Yes | Admin |
| GET | `/reports/revenue` | Get revenue report | Yes | Admin |

---

## 🔒 Authentication & Security

### How Authentication Works
1. User signs up → Account created in Supabase Auth
2. User logs in → Backend generates JWT token
3. Frontend stores token in `localStorage`
4. Every API request includes: `Authorization: Bearer <token>`
5. Backend verifies token on protected routes

### Security Features
- ✅ **Password Hashing** - Supabase handles bcrypt hashing
- ✅ **JWT Tokens** - Secure stateless authentication
- ✅ **Role-Based Access Control (RBAC)** - Admin vs Tenant permissions
- ✅ **Input Validation** - All inputs sanitized and validated
- ✅ **Row Level Security** - Database-level protection (Supabase RLS)
- ✅ **CORS** - Configured for frontend-backend communication

### User Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Create/edit/delete properties, manage tenants, view all data, generate reports |
| **Tenant** | View assigned property, submit maintenance requests, view own payment history, send messages |

---

## ✅ Implemented Features

### ✔️ Fully Working
- [x] User signup and login with role selection
- [x] Admin and tenant dashboards with different layouts
- [x] Properties management (CRUD operations)
- [x] **Real-time statistics** on admin dashboard (property counts, finances)
- [x] Maintenance request submission and tracking
- [x] Payment recording and history
- [x] Messaging between users
- [x] Occupancy and revenue reports
- [x] Calendar/events system
- [x] Role-based access control
- [x] Input validation and error handling
- [x] **Dynamic data fetching** from backend APIs

### In Progress / Future Enhancements
- Payment reminders and notifications
- Email notifications for maintenance requests
- File upload for property images
- Advanced filtering and search
- Real-time chat with websockets
- Expense tracking system
- Tenant application management
- Document management system
- Automated rent collection integration

---

## Summary of Recent Updates

### Version 2.0 - Notices System Implementation
- Replaced generic messaging with purpose-built notices and announcements system
- Added priority-based notices (normal, high, urgent) with color coding
- Implemented read/unread tracking for tenant notices
- Created admin interface for posting and managing notices
- Added database tables: `notices` and `notice_reads`
- Updated API endpoints: `/api/notices` with full CRUD operations

### Version 1.5 - Mobile Responsiveness
- Redesigned all dashboard components with Tailwind CSS responsive breakpoints
- Implemented adaptive layouts for mobile, tablet, and desktop
- Added flexible grid systems that stack on smaller screens
- Optimized navigation header for mobile devices
- Enhanced calendar and sidebar components with responsive stacking

### Version 1.0 - Core Features
- User authentication with role-based access control
- Property management with CRUD operations
- Maintenance request tracking and status updates
- Payment submission and history tracking
- Calendar events with admin confirmation workflow
- Reporting and analytics dashboard
- Profile management and password changes

---

## Known Issues & Solutions

### RESOLVED: Property Creation Validation Error
**Problem**: Frontend sends `status: "available"` but backend expected `"vacant"` or `"occupied"`

**Solution**: Updated backend validation to accept `available`, `occupied`, `maintenance`

**File Changed**: `backend/routes/properties.js`

### ✅ RESOLVED: Admin Dashboard Shows Zero Values
**Problem**: Dashboard cards showed hardcoded 0 values instead of real data

**Solution**: Connected components to backend APIs:
- `overview.jsx` - Now fetches properties and payments data
- `Summary section.jsx` (admin) - Fetches properties, messages, maintenance counts
- `Summary section.jsx` (user) - Fetches payment, message, alert data

**Files Changed**: 
- `frontend/src/components/dashboard-admin/dashboard-admin-components/overview.jsx`
- `frontend/src/components/dashboard-admin/dashboard-admin-components/Summary section.jsx`
- `frontend/src/components/dashboard-user/dashboard-user-components/Summary section.jsx`

### ✅ RESOLVED: Missing API Functions
**Problem**: Frontend components couldn't fetch tenants, messages, or reports

**Solution**: Added comprehensive API client in `frontend/src/Services/api.js`:
- `tenantsAPI` - Fetch all tenants
- `communicationAPI` - Get messages, send messages
- `reportsAPI` - Get occupancy and revenue reports
- `paymentsAPI` - Get payment history

---

## 🧪 Testing
