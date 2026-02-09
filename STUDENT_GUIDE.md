# PropManager - What We Built (Student-Friendly Explanation)

## What is PropManager?

PropManager is a website that helps landlords manage their rental properties and helps tenants communicate with their landlords. Think of it like a Facebook for property management.

---

## What Can Landlords (Admins) Do?

1. **See Dashboard** - Overview of all their properties and money owed
2. **Manage Properties** - Add, update, or delete rental properties
3. **Track Tenants** - See all tenant information and contact details
4. **Confirm Notices** - When tenant sends notice to move out, landlord can confirm it
5. **Close Events** - Mark maintenance completed and other tasks done
6. **View Payments** - See which tenants paid and who owes money
7. **See Past Events** - Review completed maintenance and notices

---

## What Can Tenants (Users) Do?

1. **View Dashboard** - See their property info and money they owe
2. **Request Maintenance** - Tell landlord something needs fixing
3. **Pay Rent** - Submit payment through the website
4. **Send Notices** - Tell landlord they want to move out
5. **View Events** - See upcoming appointments and past events
6. **Track Status** - Check if landlord confirmed or closed their requests

---

## The Problem We Fixed

### Original Problem
The landlord's buttons to confirm notices and mark events done looked like they worked but actually didn't do anything. When a landlord clicked the button, nothing happened.

### Why It Happened
The website's server (the computer that runs the code) had a problem. It was like having a security guard at a door but forgetting to actually start their shift. The guard's job description existed, but the guard wasn't actually working.

### How We Fixed It
In the server code, we found places that said:
```
requireAdmin
```

But they needed to say:
```
requireAdmin('admin')
```

It's the difference between "I need an admin" (which does nothing) and "I need an admin and I'm calling them" (which actually does something).

---

## What We Updated (Technical Summary for Students)

### Backend (Server Side) - 3 Files

**1. backend/routes/events.js**
- Fixed 4 endpoints where landlord confirms notices and marks events done
- Changed: `requireAdmin` → `requireAdmin('admin')`
- Result: Buttons now work

**2. backend/routes/maintenance.js**
- Fixed 1 endpoint for updating maintenance status
- Same fix as above

**3. backend/routes/payments.js**
- Fixed 1 endpoint for admin to add payments
- Same fix as above

### Frontend (Website Side) - 6 Files

**1. Summary section.jsx**
- Removed unnecessary "Properties Occupied" card
- Cleaner dashboard view

**2. overview.jsx**
- Changed "Units Occupied" to "Total Properties"
- Added "Outstanding Balance" display
- More accurate information

**3. Admin Calendar (upcomingActivity.jsx)**
- Added "Upcoming" and "Past Events" tabs
- Fixed confirm and mark done buttons
- Better styling and positioning

**4. Tenant Calendar (upcomingActivity.jsx)**
- Added "Upcoming" and "Past Events" tabs
- Shows status: "Pending", "Confirmed", or "Closed"
- Auto-updates when landlord takes action

**5. Tenant Actions (options.jsx)**
- Added property dropdown for maintenance requests
- Added payment submission form
- Shows outstanding balance
- Calculates what tenant owes

**6. API Service (api.js)**
- Added payment submission method
- All endpoints properly connected

---

## How the Fixes Work (Simple Explanation)

### Before Fix
```
Landlord clicks "Confirm" button
  → Website sends message to server
  → Server has a guard that isn't working
  → Server doesn't respond
  → Nothing happens
```

### After Fix
```
Landlord clicks "Confirm" button
  → Website sends message to server
  → Server's guard is actually working
  → Guard checks: "Are you admin?" → YES
  → Server processes the confirmation
  → Event status changes to "Confirmed"
  → Tenant sees the update
```

---

## Testing the Application

### How to Start

**Terminal 1:**
```bash
cd backend
node server.js
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

**Browser:**
Go to `http://localhost:5173`

### Test Accounts

Admin (Landlord):
- Email: admin@test.com
- Password: Admin123!

Tenant (Renter):
- Email: tenant@test.com
- Password: Tenant123!

### What to Test

1. Log in as admin
2. Find a pending event in calendar
3. Click "Confirm" button
   - Should change to "Confirmed by Admin"
4. Click "Mark Done" button
   - Should change to "Closed"
   - Should move to Past Events tab

5. Log in as tenant
6. Submit a maintenance request (pick a property)
7. Submit a payment (enter amount)
8. Check calendar - events should show status updates

---

## Key Learning Points for Your Group

### 1. Middleware is Important
Middleware is code that runs before the main code. It acts like a security check. If middleware isn't called properly, the main code never gets permission to run.

### 2. Frontend and Backend Must Work Together
The website (frontend) sends messages to the server (backend). If either part doesn't work, the whole feature breaks.

### 3. Testing is Important
We caught this bug because we tested what happened when we clicked buttons. Testing shows us what's broken.

### 4. Good Error Messages Help
When something fails, clear error messages help developers understand what went wrong. We added console logs and error handling throughout.

### 5. Status Tracking is Useful
By showing status (pending, confirmed, closed), users understand what's happening with their requests.

---

## Code Architecture (Simple Version)

### How Information Flows

```
User Action (clicks button)
  ↓
Frontend (React) sends request to Server
  ↓
Server (Node.js) checks permission with middleware
  ↓
If allowed, update database (Supabase)
  ↓
Send response back to Frontend
  ↓
Frontend updates what user sees
  ↓
User sees the change
```

### The Tools We Use

- **React** - Makes the website interactive
- **Node.js + Express** - Runs the server
- **Supabase** - Stores all the data (database)
- **JWT** - Keeps user login secure
- **Tailwind CSS** - Makes it look nice

---

## If You Want to Learn More

### About Middleware
Middleware is like a security guard. Learn how it checks permissions before letting code run.

### About JWT Tokens
When you log in, the server gives you a special code (token). You send this code with every request to prove you're you.

### About React Hooks
`useState` and `useEffect` are how React components remember information and update the screen.

### About Express Routes
Routes are like doors. Each route handles a different request (getting data, adding data, updating data, deleting data).

---

## What We Learned This Semester

1. How to build a full website (frontend + backend)
2. How databases work (Supabase / PostgreSQL)
3. How to secure websites (JWT, Role-Based Access)
4. How to handle errors properly
5. How to work with APIs
6. How to debug problems
7. How important testing is

---

## Final Notes for Your Group

This is a real project that:
- Has a working database
- Handles user authentication securely
- Works for multiple users with different roles
- Updates in real-time
- Has proper error handling

You can be proud of building this. It's a legitimate software product that could be used in real life.

Good luck with your presentation!

---

## Quick Reference

### Files That Changed
- 3 Backend files (routes)
- 6 Frontend files (components + services)
- 0 Database files (no schema changes needed)

### What Users Can Do Now
- Landlords: Confirm notices, mark events done, see accurate stats
- Tenants: Submit maintenance, pay rent, see event status updates

### How to Explain It
"We fixed a bug where admin buttons didn't work. The problem was middleware wasn't being called properly. We changed the code to call the function correctly, and now everything works."
