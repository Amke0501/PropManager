# Render Deployment Guide

## Backend Deployment on Render

### Initial Setup

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Sign in with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Amke0501/PropManager`
   - Click "Connect"

3. **Configure Web Service**
   ```
   Name: propmanager-backend (or your preferred name)
   Region: Choose nearest region
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node server.js
   ```

4. **Set Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
   
   Get these values from:
   - SUPABASE_URL & SUPABASE_ANON_KEY: Supabase Project Settings → API
   - SUPABASE_SERVICE_KEY: Supabase Project Settings → API (Service Role Key)
   - JWT_SECRET: Use a strong random string

5. **Select Plan**
   - Free tier is fine for development
   - Click "Create Web Service"

6. **Wait for Deployment**
   - Render will build and deploy your backend
   - Takes 2-5 minutes
   - You'll get a URL like: `https://propmanager-backend.onrender.com`

### Update Frontend with Backend URL

After deployment, update your frontend API URL:

**File: `frontend/src/Services/api.js`**
```javascript
const API_URL = 'https://your-backend-name.onrender.com/api';
```

Replace `your-backend-name` with your actual Render service name.

### Automatic Deployments

Render automatically redeploys when you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### Check Deployment Status

1. Go to Render Dashboard
2. Click on your service
3. View "Logs" tab to see deployment progress
4. Check "Events" tab for deployment history

### Test Your Backend

Visit in browser:
```
https://your-backend-name.onrender.com/api/properties
```

Should return JSON response (requires authentication token).

### Troubleshooting

**Service shows "Deploy failed":**
- Check Logs tab for error messages
- Verify environment variables are set correctly
- Ensure `backend/package.json` exists

**Backend sleeps after inactivity (Free tier):**
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Upgrade to paid plan to prevent sleeping

**CORS errors:**
- Verify `server.js` has CORS enabled for your Vercel domain
- Add your Vercel URL to CORS whitelist if needed

### Update Environment Variables

1. Go to service in Render Dashboard
2. Click "Environment" in left sidebar
3. Update values
4. Service auto-redeploys with new variables

---

## Current Deployment

**Backend URL:** `https://propmanager-backend.onrender.com`
**API Base:** `https://propmanager-backend.onrender.com/api`
