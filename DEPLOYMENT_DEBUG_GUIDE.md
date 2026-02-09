# Deployment Debug Guide for PropManager

**Last Updated:** February 9, 2026  
**Status:** Active - Property Dropdown Empty Issue

---

## 1. DEPLOYMENT ARCHITECTURE

```
┌─────────────────────┐
│   Vercel (Frontend) │
│ React + Vite + Tailwind
│ https://propmanager.vercel.app
└──────────┬──────────┘
           │ (API calls)
           ↓
┌─────────────────────┐
│ Render (Backend)    │
│ Express + Node.js   
│ https://propmanager-1.onrender.com
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ Supabase (Database) │
│ PostgreSQL         
│ https://supabase.co
└─────────────────────┘
```

---

## 2. CRITICAL INSTALLATION STEPS

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 3. KEY ENDPOINTS TO TEST

### Test Endpoints (No Authentication Required)
```
GET https://propmanager-1.onrender.com/api/test/properties
GET https://propmanager-1.onrender.com/api/test-supabase
```

### Authenticated Endpoints
```
GET https://propmanager-1.onrender.com/api/properties
  → Returns properties for dropdown
```

---

## 4. ENVIRONMENT VARIABLES VERIFICATION

### Backend (.env file)
Required variables in `backend/.env`:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Anon key for client auth
- `SUPABASE_SERVICE_KEY` - Service key for admin operations
- `JWT_SECRET` - For JWT token generation

### Render Deployment
Required in Render Environment section:
- All 4 backend env vars must be set
- Check Render Dashboard → Settings → Environment

### Frontend (No .env needed)
- API URL hardcoded in `frontend/src/Services/api.js`
- Current: `https://propmanager-1.onrender.com/api`

---

## 5. COMMON ISSUES & SOLUTIONS

### Issue: Empty Property Dropdown
**Symptom:** Users see no options when clicking property field  
**Root Causes:**
1. Properties don't exist in Supabase database
2. API returning empty array `[]`
3. Auth token not sent with request
4. CORS blocking request

**Solution Path:**
```
Step 1: Test without auth
→ Visit: https://propmanager-1.onrender.com/api/test/properties
→ Should show all properties

Step 2: If empty, check Supabase
→ Open Supabase dashboard
→ Check properties table
→ Verify 2+ properties exist with all fields

Step 3: If properties exist, check backend
→ Check backend logs on Render
→ Look for "Test properties error:" messages

Step 4: Test with auth
→ Log in as user
→ Open browser DevTools Console
→ Check "Properties API response:" logs
```

### Issue: 401 Unauthorized on API calls
**Symptom:** API calls return 401 error  
**Root Causes:**
1. Auth token not in localStorage
2. JWT_SECRET mismatch
3. Supabase auth failure

**Solution:**
```bash
# In browser console:
localStorage.getItem('authToken')  // Should return token

# Verify token format:
# Should be: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Issue: CORS Errors
**Symptom:** "Access to fetch blocked by CORS"  
**Solution:** Backend CORS already configured in server.js
```javascript
app.use(cors());  // ✅ Configured
```

### Issue: Database Connection Failed
**Symptom:** "Supabase connection failed" error  
**Solution:** Verify environment variables
```javascript
// Render checks these on startup:
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Found' : '❌ Missing');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Found' : '❌ Missing');
```

---

## 6. DETAILED DEBUGGING PROCEDURES

### Procedure A: Test Backend Without Authorization

1. Open browser and visit:
   ```
   https://propmanager-1.onrender.com/api/test/properties
   ```

2. Expected Response (if properties exist):
   ```json
   {
     "success": true,
     "count": 2,
     "message": "Found 2 properties in database",
     "data": [
       {
         "id": "uuid-1",
         "name": "Property 1",
         "address": "123 Main St",
         ...
       },
       {...}
     ]
   }
   ```

3. If you see `"count": 0` or `"data": []`:
   - Properties don't exist in database
   - Go to Supabase dashboard
   - Navigate to properties table
   - Create test property: `INSERT INTO properties (...) VALUES (...);`

### Procedure B: Check Backend Logs on Render

1. Go to Render Dashboard
2. Select your backend service
3. Open "Logs" tab
4. Look for:
   - `Server is running on port 10000` ✅
   - `SUPABASE_URL: Found` ✅
   - `SUPABASE_SERVICE_KEY: Found` ✅
   - `Environment check:` section

If you see "Missing" for any env var:
- Go to Settings → Environment
- Add missing variables
- Redeploy service

### Procedure C: Frontend Debugging

1. Go to https://propmanager.vercel.app
2. Open browser DevTools (F12)
3. Go to Console tab
4. Log in as user
5. Click "Submit Notice" on dashboard
6. Look for console logs:
   ```
   ✅ Auth token available: true
   ✅ Properties API response: {...}
   ✅ Number of properties: 2
   ```

If you see:
- `Auth token available: false` → Login didn't work
- `Number of properties: 0` → Backend returned empty
- `Error fetching properties: ...` → API call failed

### Procedure D: Verify Database Access

1. Open Supabase dashboard
2. Go to SQL Editor
3. Run query:
   ```sql
   SELECT COUNT(*) as total_properties FROM properties;
   SELECT * FROM properties LIMIT 10;
   ```

4. Expected result: See 2+ properties with all fields

---

## 7. DEPLOYMENT CHECKLIST

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Backend environment variables set in Render
- [ ] Supabase connection working
- [ ] At least 1 property exists in database
- [ ] Test endpoint returns properties
- [ ] Login works without errors
- [ ] Property dropdown shows options
- [ ] Can submit notice without errors

---

## 8. FILES INVOLVED IN PROPERTY DROPDOWN

### Frontend
- `frontend/src/Services/api.js` (API client definition)
- `frontend/src/components/dashboard-user/dashboard-user-components/options.jsx` (Dropdown UI)
- `frontend/src/components/dashboard-user/dashboard-user.jsx` (Dashboard wrapper)

### Backend
- `backend/routes/properties.js` (Property endpoint handler)
- `backend/server.js` (Server config + test endpoints)
- `backend/middleware/auth.js` (Authentication middleware)
- `backend/supabaseClient.js` (Database connection)

### Database
- `Supabase → properties table` (Properties data storage)

---

## 9. HARD RESTART (If stuck)

### Backend
```bash
cd backend
rm -r node_modules
npm install
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run dev
```

### Render
1. Go to Render Dashboard
2. Go to Logs
3. Click "Clear Logs"
4. Click "Manual Deploy" (or push to GitHub)

---

## 10. CRITICAL COMMAND REFERENCES

### Test endpoints:
```bash
# Test properties without auth
curl https://propmanager-1.onrender.com/api/test/properties

# Test Supabase connection
curl https://propmanager-1.onrender.com/api/test-supabase

# Test properties with auth
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://propmanager-1.onrender.com/api/properties
```

### Local testing:
```bash
# Terminal 1: Start backend
cd backend && npm start

# Terminal 2: Start frontend
cd frontend && npm run dev

# Terminal 3: Test properties
curl http://localhost:3000/api/test/properties
```

---

## 11. NEXT STEPS

1. **Immediate:** Test `/api/test/properties` endpoint
2. **If empty:** Check Supabase properties table
3. **If exists:** Check Render logs for connection issues
4. **If working:** Verify frontend auth token
5. **If still empty:** Review console logs in browser

---

## 12. CONTACT / LOG REFERENCES

When reporting issues, include:
- Output from test endpoints
- Render logs (last 50 lines)
- Browser console logs (F12 → Console)
- Supabase query results
- Error messages with timestamps

---
