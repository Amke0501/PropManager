# How to Share PropManager with Your Group

## Quick Sharing Guide for Group Members

Your PropManager project is complete and ready to share. Here are the easiest ways to do it.

---

## Method 1: Using GitHub (Best Method)

### Step 1: Push Your Code
If you have Git set up:

```bash
cd PropManager
git add .
git commit -m "Final update: Admin buttons working, payment submission, past events tabs"
git push origin main
```

### Step 2: Group Members Pull Code
Other team members run:

```bash
git clone https://github.com/YourUsername/PropManager.git
cd PropManager
```

### Step 3: Install Dependencies

In the backend folder:
```bash
cd backend
npm install
```

In the frontend folder:
```bash
cd frontend
npm install
```

---

## Method 2: Share Files Directly

### Step 1: Create a ZIP File
1. Right-click the PropManager folder
2. Select "Send to" → "Compressed (zipped) folder"
3. Name it "PropManager_Final.zip"

### Step 2: Share the ZIP
- Email the ZIP file to group members
- Or use OneDrive/Google Drive
- Or use a USB drive

### Step 3: Group Members Extract and Setup
1. Extract the ZIP file
2. Open terminal and go to the folder
3. Run setup commands below

---

## Setup Commands for Group Members (After Getting Files)

```bash
# Backend setup
cd backend
npm install
npm install --save express cors dotenv @supabase/supabase-js jsonwebtoken

# Frontend setup
cd ../frontend
npm install
npm install --save react react-dom react-router-dom axios lucide-react
```

---

## How to Run the Project

### Terminal 1 - Start Backend
```bash
cd backend
node server.js
```

You should see:
```
Server is running on port 3000
```

### Terminal 2 - Start Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
Local: http://localhost:5173
```

---

## Test the Application

### Open Browser
Go to: `http://localhost:5173`

### Log In (Choose One)

**As Admin:**
- Email: admin@test.com
- Password: Admin123!

**As Tenant:**
- Email: tenant@test.com
- Password: Tenant123!

---

## What to Show in Presentation

### Admin Dashboard Demo:
1. Show dashboard with property count and outstanding balance
2. Click "Confirm" button on a pending event
   - Event changes to "Confirmed by Admin"
3. Click "Mark Done" button
   - Event changes to "Closed"
   - Event moves to Past Events tab

### Tenant Dashboard Demo:
1. Submit a maintenance request
   - Select property from dropdown
   - See it in calendar
2. Submit a payment
   - See outstanding balance decrease
   - Admin sees the payment in dashboard
3. View events
   - Show upcoming events tab
   - Show past events tab
   - Show status updates (pending, confirmed, closed)

---

## If Something Doesn't Work

### Problem: Server won't start
Solution:
```bash
npm install
node server.js
```

### Problem: Can't connect to database
Check:
1. .env file exists in backend folder
2. SUPABASE_URL and SUPABASE_SERVICE_KEY are correct

### Problem: Frontend won't load
Solution:
```bash
npm install
npm run dev
```

### Problem: Buttons still don't work
Solution:
1. Hard refresh browser: Ctrl + Shift + R
2. Clear localStorage: Open F12, Console, type: `localStorage.clear()`
3. Log in again

---

## Files Your Group Should Know About

Read these files to understand what was done:

1. **FINAL_UPDATE.md** - Complete explanation of all changes in simple English
2. **LATEST_CHANGES.md** - Summary of what was fixed and how to test
3. **README.md** - How to set up and use the application
4. **GROUP_REPORT.md** - Detailed technical report (optional, for reference)

---

## Important: Do Not Share These

- **.env file** - This has secret database passwords (only share with trusted team members or professor)
- **node_modules folder** - Too large, use `npm install` instead
- **.git folder** - If using Git, this is created automatically

---

## File Size Estimate

When sharing:
- With .env + node_modules: ~2 GB (too large)
- Without them (recommended): ~100 MB

To exclude node_modules and .env:
```bash
# Create ZIP without large folders
Exclude: node_modules, .git
Include: .env (secure sharing only)
```

---

## Technology Stack (Share with Group)

- Backend: Node.js + Express
- Frontend: React + Vite
- Database: Supabase (PostgreSQL)
- Authentication: JWT Tokens
- Styling: Tailwind CSS

---

## Final Checklist Before Sharing

- [ ] Both backend and frontend tested
- [ ] Admin buttons working (Confirm and Mark Done)
- [ ] Tenant payment submission working
- [ ] Past events tabs visible
- [ ] Documentation updated (README, FINAL_UPDATE.md)
- [ ] .env file with correct credentials
- [ ] All npm packages listed in package.json

---

## Questions?

If group members have questions:
1. Check FINAL_UPDATE.md (explains everything)
2. Check DEBUG_NOTES.md (technical details)
3. Ask the team member who did the updates

Good luck with your group presentation!
