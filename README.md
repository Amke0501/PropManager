# PropManager - Property Management System

A full-stack web application for managing rental properties, tenants, maintenance requests, and payments. 
---

## Project Overview

PropManager helps property managers and landlords:
- Manage multiple properties and tenant information
- Track rental payments and payment history
- Handle maintenance requests from tenants
- Communicate with tenants through messaging
- Generate reports on occupancy and revenue
- Control access based on user roles (admin vs tenant)

---

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for APIs
- **Supabase** - Database (PostgreSQL) + Authentication + Storage
- **JWT** - Token-based authentication

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Page navigation
- **Lucide React** - Icons

### Database
- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)** - Data protection

---

## Project Structure

```
PropManager/
├── backend/
│   ├── routes/
│   │   ├── auth.js              (Login/signup endpoints)
│   │   ├── properties.js        (Property CRUD)
│   │   ├── tenants.js           (Tenant CRUD)
│   │   ├── maintenance.js       (Maintenance requests)
│   │   ├── payments.js          (Payment tracking)
│   │   ├── communication.js     (Messaging)
│   │   └── reports.js           (Reports & analytics)
│   ├── middleware/
│   │   ├── auth.js              (Token verification)
│   │   └── rbac.js              (Role-based access control)
│   ├── utils/
│   │   └── validation.js        (Input validation)
│   ├── server.js                (Main server file)
│   ├── supabaseClient.js        (Database connection)
│   └── .env                     (Environment variables)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx        (Authentication page)
│   │   │   ├── Dashboard.jsx    (Main dashboard)
│   │   │   └── ...
│   │   ├── Services/
│   │   │   └── api.js           (API calls to backend)
│   │   └── main.jsx
│   └── package.json
│
└── README.md (this file)
```

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PropManager
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Environment Variables

Create `.env` file in `backend/` folder:
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_key
JWT_SECRET=your_secret_key
PORT=3000
```

---

## Running the Application

### Start Backend
```bash
cd backend
node server.js
```
Server runs on `http://localhost:3000`

### Start Frontend
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

---

## API Endpoints

### Authentication
```
POST   /api/auth/signup       - Create new user account
POST   /api/auth/login        - Login with email & password
POST   /api/auth/logout       - Logout user
GET    /api/auth/me           - Get current user info
```

### Properties (Admin Only)
```
GET    /api/properties        - Get all properties (filtered by role)
POST   /api/properties        - Create new property
PUT    /api/properties/:id    - Update property
DELETE /api/properties/:id    - Delete property
```

### Tenants
```
GET    /api/tenants           - Get all tenants
POST   /api/tenants           - Add new tenant
PUT    /api/tenants/:id       - Update tenant
DELETE /api/tenants/:id       - Remove tenant
```

### Maintenance Requests
```
POST   /api/maintenance       - Create maintenance request
GET    /api/maintenance       - View requests (filtered by role)
PUT    /api/maintenance/:id   - Update request status
```

### Payments
```
POST   /api/payments          - Record payment (admin)
GET    /api/payments          - View payment history (filtered by role)
```

### Reports
```
GET    /api/reports/occupancy - Get property occupancy status
GET    /api/reports/revenue   - Get revenue summary
```

---

## Authentication & Security

- Passwords hashed using Supabase's built-in bcrypt
- JWT tokens for API authentication
- Token stored in browser's localStorage
- Role-based access control (RBAC):
  - **Admin**: Full access to all features
  - **Tenant**: Can only view their own properties and data
- Supabase Row Level Security (RLS) enforces data protection at database level

---

## Features

### Completed
- User signup and login with role selection
- Properties management (create, read, update, delete)
- Tenant management and assignment to properties
- Maintenance request submission and tracking
- Payment recording and history
- User-to-user messaging
- Admin reports (occupancy, revenue)
- Role-based data filtering
- Input validation and error handling

### In Progress
- Tenant dashboard UI
- Payment reminder notifications
- Advanced filtering options
- Mobile app version

---

## 👥 Team & Responsibilities

### Backend Developer 1 (Amkelwe)
- Authentication system (signup/login)
- Properties CRUD operations
- Tenants management
- Admin reports
- API schema alignment with frontend
- Database validation and error handling

### Backend Developer 2 (Taylin)
- Maintenance request system
- Payment tracking and recording
- User communication/messaging
- Additional API endpoints
- Database schema design (shared)

### Frontend Developer
- UI components and pages
- Frontend state management
- API integration
- User experience design
- Login page updates for backend integration

---

##  Known Issues & Solutions

### Issue: Add Property Button Not Working (RESOLVED )

**What Was the Problem?**
Frontend form sends: `{name, address, rent, status}`
Backend expected: `{address, bedrooms, bathrooms, rent}`

**Root Cause**
The frontend and backend were not communicating about what data to send/receive. They had different expectations about the property structure.

**How We Fixed It**
1. Updated backend `/api/properties` POST route to accept frontend's fields
2. Changed validation to check for status="vacant" or "occupied"
3. Removed bedrooms/bathrooms validation
4. Frontend Login.jsx updated to call backend API instead of fake login

**Status**: FIXED (As of Feb 3, 2026)

---

## Testing

### Manual Testing

1. **Test Login Works**
   - Go to http://localhost:5173
   - Sign up with a new account
   - Check that localStorage has 'authToken' (Dev Tools → Application → Storage)

2. **Test Add Property**
   - After login, click "Add Property"
   - Fill in: Name, Address, Rent, Status
   - Click submit
   - Property should appear in the list

3. **Test API Directly**
   ```bash
   # Login and get token
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@test.com","password":"Test@123"}'
   
   # Use token to create property
   curl -X POST http://localhost:3000/api/properties \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Property","address":"123 Main","rent":1200,"status":"vacant"}'
   ```

---

##  Recent Changes

### Commit: "Fix Add Property to work with frontend form"
- Changed POST /api/properties to accept {name, address, rent, status}
- Removed bedrooms/bathrooms fields
- Added validation for status (vacant/occupied)
- Updated PUT /api/properties to handle new fields

---

## Deployment

### Backend Deployment (When Ready)
Recommended: Render, Railway, or Heroku
1. Push to GitHub
2. Connect to hosting platform
3. Add environment variables
4. Deploy

### Frontend Deployment (When Ready)
Recommended: Vercel or Netlify
1. Build: `npm run build`
2. Connect GitHub repo
3. Set API URL
4. Deploy

---

## Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Supabase Guide](https://supabase.com/docs)
- [REST API Best Practices](https://restfulapi.net/)
- [RBAC Concepts](https://en.wikipedia.org/wiki/Role-based_access_control)

---

## Support & Communication

For issues or questions:
1. Check this README first
2. Create a GitHub issue
3. Ask in team group chat
4. Code review with teammates

---

## License

Educational project - Learning purposes only

---

*
