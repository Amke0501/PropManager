# PropManager - Final Update for Group Project

## Summary of What the App Can Do Now

PropManager is a complete property management system that helps landlords manage properties and tenants. Here is what works:

### Admin Features
- Log in securely with admin account
- See a dashboard showing total properties and outstanding balance money
- Manage properties (add, update, delete)
- View all upcoming events in calendar
- Confirm tenant notices (changes status to "Confirmed by Admin")
- Mark events as done/closed
- View past events in separate tab
- See tenant maintenance requests
- View all tenant information
- Track payments and see who owes money

### Tenant Features
- Log in securely with tenant account
- See their assigned property details
- Submit maintenance requests (with property selection dropdown)
- Submit payment to landlord
- View payment history and outstanding balance
- Submit move-out notices
- See calendar of events with status (Pending, Confirmed, Closed)
- View past events in separate tab
- Message the landlord

---

## What We Fixed and Updated in This Final Session

### Backend Changes (Server-Side Code)
The backend is the code that runs on the server and handles all requests from the app.

**Modified Files:**

1. **backend/routes/events.js** - Calendar events system
   - Fixed the confirm event button (changes status to "confirmed")
   - Fixed the mark done button (changes status to "completed")
   - Fixed middleware issue where admin buttons were not responding
   - All 4 admin-only endpoints now work correctly

2. **backend/routes/maintenance.js** - Maintenance requests system
   - Fixed admin endpoint to update maintenance status

3. **backend/routes/payments.js** - Payment tracking system
   - Fixed admin endpoint to add payments

**What the Backend Fix Did:**
The problem was that admin buttons weren't working because the server middleware wasn't being called properly. We fixed the function calls from `requireAdmin` to `requireAdmin('admin')` so the server now properly checks if the user is an admin before allowing them to confirm or mark done events.

### Frontend Changes (Website Interface)
The frontend is what users see on their screen.

**Modified Files:**

1. **frontend/src/components/dashboard-admin/dashboard-admin-components/Summary section.jsx**
   - Removed the "Properties Occupied" card (it was unnecessary)
   - Kept the important summary information only

2. **frontend/src/components/dashboard-admin/dashboard-admin-components/overview.jsx**
   - Changed "Units Occupied" to "Total Properties" (more accurate)
   - Updated to show outstanding balance that needs to be paid

3. **frontend/src/components/dashboard-admin/dashboard-admin-components/upcomingActivity.jsx** - Admin Calendar
   - Added "Upcoming" and "Past Events" tabs
   - Fixed Confirm button so it is clickable and responsive
   - Fixed Mark Done button so it is clickable and responsive
   - When admin clicks Confirm, event status changes to "Confirmed by Admin"
   - When admin clicks Mark Done, event status changes to "Closed"
   - Added better styling and button positioning

4. **frontend/src/components/dashboard-user/dashboard-user-components/upcomingActivity.jsx** - Tenant Calendar
   - Added "Upcoming" and "Past Events" tabs
   - Shows event status: "Pending Admin Review", "Confirmed by Admin", or "Closed"
   - Automatically updates when admin takes action

5. **frontend/src/components/dashboard-user/dashboard-user-components/options.jsx** - Tenant Actions
   - Added dropdown to select which property the maintenance is for
   - Added payment submission form with amount input
   - Shows current outstanding balance
   - Calculates how much tenant owes

6. **frontend/src/Services/api.js** - API Communication
   - Added new API method for tenants to submit payments
   - Updated all API calls to work with the fixed backend

---

## How Your Group Members Can Access This Updated Version

### Option 1: Using Git (Recommended)
If your group is using Git/GitHub:

1. One person pushes all changes to GitHub:
   ```
   git add .
   git commit -m "Final update: Fix admin buttons, add payment submission, add past events tabs"
   git push origin main
   ```

2. Other group members pull the latest code:
   ```
   git pull origin main
   ```

### Option 2: File Sharing
If not using Git, share the entire `PropManager` folder with your group. They need:
- The entire `backend/` folder
- The entire `frontend/` folder
- The `.env` file (so they have the database credentials)

### Option 3: Direct Access
If you want group members to test online, they can:
1. Get the IP address of your computer: `ipconfig` in terminal and find IPv4 address
2. Change `localhost` in the app to that IP address
3. Both backend and frontend must be running

---

## How to Run the Updated Version

### First Time Setup

1. **Backend Setup:**
   ```
   cd backend
   npm install
   ```

2. **Frontend Setup:**
   ```
   cd frontend
   npm install
   ```

### Starting the Application

1. **Start Backend (Terminal 1):**
   ```
   cd backend
   node server.js
   ```
   Should say: "Server is running on port 3000"

2. **Start Frontend (Terminal 2):**
   ```
   cd frontend
   npm run dev
   ```
   Should show: "Local: http://localhost:5173"

3. **Open in Browser:**
   Go to `http://localhost:5173` and log in

### Test Accounts

**Admin Account:**
- Email: admin@test.com
- Password: Admin123!

**Tenant Account:**
- Email: tenant@test.com
- Password: Tenant123!

---

## What Files Were Updated (Quick Reference)

### Backend Files Modified
- `backend/routes/events.js` (Fixed confirm and mark done endpoints)
- `backend/routes/maintenance.js` (Fixed admin endpoint)
- `backend/routes/payments.js` (Fixed admin endpoint)

### Frontend Files Modified
- `frontend/src/components/dashboard-admin/dashboard-admin-components/Summary section.jsx`
- `frontend/src/components/dashboard-admin/dashboard-admin-components/overview.jsx`
- `frontend/src/components/dashboard-admin/dashboard-admin-components/upcomingActivity.jsx`
- `frontend/src/components/dashboard-user/dashboard-user-components/upcomingActivity.jsx`
- `frontend/src/components/dashboard-user/dashboard-user-components/options.jsx`
- `frontend/src/Services/api.js`

---

## Simple English Explanation of the Changes

### What Was Broken
Admin buttons (Confirm and Mark Done) appeared on the screen but nothing happened when you clicked them. This was because the backend server was not properly checking if the user was an admin before allowing the action.

### How We Fixed It
We fixed a problem in the server code where a function was not being called correctly. Think of it like a door with a security guard (middleware). The guard needs to check your ID (role) before letting you through. The code was passing the guard's instructions but not actually running them. We fixed it so the guard now actually runs and checks.

### What Improved
1. **Admin Confirm Button Works** - Landlords can now confirm tenant notices
2. **Admin Mark Done Button Works** - Landlords can now close completed events
3. **Status Updates Show** - Tenants now see when their requests are confirmed or closed
4. **Past Events Tab** - Both admins and tenants can see completed events separately
5. **Payment Form Works** - Tenants can now submit payments through the app
6. **Outstanding Balance Updates** - Admin dashboard shows accurate amount owed

### The Learning Point
This taught us about middleware - functions that run before the main code to check permissions. If middleware is not called (invoked) properly, the main code never gets permission to run.

---

## Next Steps for Your Group

1. Each group member should pull/receive the updated code
2. Test the features listed above
3. Make sure admin buttons work (Confirm and Mark Done)
4. Make sure tenant payments submit successfully
5. Verify status updates appear for tenants
6. Document any remaining issues

---

## Contact for Questions
If you have questions about the changes, check the DEBUG_NOTES.md file or ask the team member who made these updates.

Good luck with your final presentation!
