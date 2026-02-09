# Quick Troubleshooting Guide

## ❌ Problem: Property Dropdown is Empty

### Quick Diagnostic Checklist
- [ ] Did you test the endpoint: `https://propmanager-1.onrender.com/api/test/properties`?  
- [ ] Does it return properties or an empty array `[]`?
- [ ] Are there actually properties in your Supabase database?
- [ ] Can you see 2+ properties in: Supabase → properties table?

### Step-by-Step Fix

**Step 1: Test Backend Without Authentication**
```
Open in browser: https://propmanager-1.onrender.com/api/test/properties

Expected response if properties exist:
{
  "success": true,
  "count": 2,
  "message": "Found 2 properties in database",
  "data": [...]
}

Actual response: ___________________
```

**Step 2: Check Supabase Database**
1. Go to supabase.co
2. Open your PropManager project
3. Go to "properties" table in SQL Editor
4. Run: `SELECT * FROM properties;`

Properties found? [ ] Yes [ ] No

If NO properties:
- Go to Supabase → properties table (UI view)
- Click "+ New row"
- Add data: name, address, rent, bedrooms, bathrooms, status

**Step 3: Check Render Logs**
1. Go to https://render.com
2. Select your backend service
3. Click "Logs"
4. Look for errors with keywords:
   - "properties"
   - "SELECT"
   - "error"
   - "SUPABASE"

Errors found? [ ] Yes [ ] No → Copy and paste below:
```
_________________________
_________________________
_________________________
```

**Step 4: Check Frontend Console (In Browser)**
1. Log in at https://propmanager.vercel.app
2. Open DevTools: Press F12
3. Go to Console tab
4. Click "Submit Notice" on dashboard
5. You should see logs like:
```
Auth token available: true
Properties API response: {...}
Number of properties: 2
```

What do you see? ___________________

---

## ❌ Problem: Login Returns 404

### Solution
The backend URL was wrong. It's now fixed to: `https://propmanager-1.onrender.com`

Make sure to:
1. Clear browser cache: Ctrl+Shift+Delete
2. Hard refresh: Ctrl+Shift+R
3. Try logging in again

---

## ❌ Problem: 401 Unauthorized Errors

### Solution
1. Check if you're logged in
2. Check browser Console via F12
3. Run in Console: `localStorage.getItem('authToken')`
   - Should show a token starting with: `eyJhbGciOi...`
   - If blank, you're not logged in

Fix: Log out and log in again

---

## ❌ Problem: API Returns Status 500

### Solution
1. Check Render logs for error messages
2. Verify all environment variables are set:
   - SUPABASE_URL ✓?
   - SUPABASE_SERVICE_KEY ✓?
   - JWT_SECRET ✓?
3. If not set, add them in Render → Settings → Environment

---

## ❌ Problem: CORS Errors in Frontend

### Solution
CORS is already enabled on backend. Clear browser cache:
1. Open DevTools: F12
2. Right-click refresh button → Click "Empty cache and hard refresh"
3. Reload page

---

## ✅ How to Verify Everything Works

**Full Test Procedure (5 minutes):**

1. **Backend health:** 
   ```
   Visit: https://propmanager-1.onrender.com/api
   Expected: {"message": "PropManager API is running"}
   ```

2. **Database connection:**
   ```
   Visit: https://propmanager-1.onrender.com/api/test-supabase
   Expected: {"success": true, "message": "Supabase connection successful"}
   ```

3. **Properties available:**
   ```
   Visit: https://propmanager-1.onrender.com/api/test/properties
   Expected: {"success": true, "count": 2, "data": [...]}
   ```

4. **Login works:**
   - Go to https://propmanager.vercel.app
   - Sign up with: email@test.com / password123
   - Should successfully log in

5. **Property dropdown:**
   - Go to User Dashboard
   - Click "Submit Notice"
   - Click property dropdown
   - Should see your properties

---

## ⚡ Emergency Fixes (If Stuck)

### Option 1: Redeploy Backend
```bash
cd backend
git add -A
git commit -m "Force redeploy"
git push origin main
# Then: Render will auto-deploy
```

### Option 2: Check Environment Variables in Render
1. https://render.com
2. Select backend service
3. Settings → Environment
4. Verify all 4 variables exist:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_KEY
   - JWT_SECRET

### Option 3: Clear Render Cache
1. https://render.com
2. Select backend service
3. Manual Deploy → Clear Build Cache

---

## 📞 Support Checklist

Before asking for help, please have ready:
- [ ] Output from: `https://propmanager-1.onrender.com/api/test/properties`
- [ ] Number of properties in Supabase: ___
- [ ] Last 20 lines from Render logs
- [ ] Browser console error messages (F12)
- [ ] Email you used to sign up: _______________

---

## 🔗 Important Links

- **Frontend:** https://propmanager.vercel.app
- **Backend API:** https://propmanager-1.onrender.com/api
- **Database:** https://app.supabase.co (login with your account)
- **Deployment Logs - Render:** https://render.com
- **Deployment Logs - Vercel:** https://vercel.com

---

## 📝 Notes for Development Team

**Current Status:**
- Backend: Deployed on Render ✓
- Frontend: Deployed on Vercel ✓
- Database: Supabase PostgreSQL ✓
- Issue: Empty property dropdown (properties not appearing)

**Known Issues Being Tracked:**
1. [ ] Properties endpoint returns empty array
2. [ ] Test endpoint returns empty despite data in DB
3. [ ] Auth token not being sent correctly?
4. [ ] Database query issue?

**Files to Check:**
- `backend/routes/properties.js` - Property endpoint logic
- `backend/server.js` - Test endpoints
- `frontend/src/Services/api.js` - API client
- `frontend/src/components/dashboard-user/dashboard-user-components/options.jsx` - Dropdown UI
