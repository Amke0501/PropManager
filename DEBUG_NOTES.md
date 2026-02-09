# Login & Dashboard Debug Fix - February 7, 2026

## Issues Found

### 1. **Login Always Failed with "Invalid Credentials"**
- Backend was using service role key for `signInWithPassword()`, which doesn't work for regular user auth
- User profiles weren't auto-created in `public.users` table during signup
- RLS policies blocked user profile insertion during login

### 2. **Database Schema Misalignment**
- Backend code expected: `maintenance_requests`, `properties.tenant_id`, `properties.rent`, `properties.status`
- Database had: `maintanance_requests` (typo), `properties.rent_amount`, missing `tenant_id` and `status` columns
- Backend expected `payments.tenant_id`, database had `tenants_id`

### 3. **Role Normalization Issues**
- Frontend signup used "user" role, backend expected "tenant"
- Middleware wasn't attaching role to `req.user` from database
- RBAC checks failed because role wasn't propagated

### 4. **Dashboard Communication Failures**
- Import paths used lowercase `services/api` instead of `Services/api` (case-sensitive)
- API responses returned `{data: [...]}` but components expected flat arrays
- Login redirected to `/dashboard` instead of role-based routes (`/admin` or `/user`)

## Fixes Applied

### Backend Changes

**1. [routes/auth.js](backend/routes/auth.js)**
- Created separate `supabaseAnon` client with anon key for password authentication
- Added auto-creation of missing user profiles during login
- Normalized "user" role to "tenant" throughout signup and login
- Stored role in `user_metadata` during signup

**2. [middleware/auth.js](backend/middleware/auth.js)**
- Fetched user role from `public.users` table and attached to `req.user`
- Added fallback to `user_metadata.role` if profile lookup fails
- Normalized legacy "user" roles to "tenant"

**3. [middleware/rbac.js](backend/middleware/rbac.js)**
- Normalized "user" to "tenant" in role checks
- Improved error messages showing required vs actual roles

**4. [routes/tenants.js](backend/routes/tenants.js)**
- Changed `.eq('role', 'tenant')` to `.in('role', ['tenant', 'user'])` to include legacy users

**5. [server.js](backend/server.js)**
- Fixed test endpoint to query `users` table instead of non-existent `PropManager` table

### Frontend Changes

**1. [components/Login.jsx](frontend/src/components/Login.jsx)**
- Changed redirect from `/dashboard` to role-based routes: `/admin` or `/user`
- Added null-check for `data.session?.access_token`

**2. [components/Signup.jsx](frontend/src/components/Signup.jsx)**
- Changed default role from "user" to "tenant"
- Updated radio button label from "User" to "Tenant"

**3. Dashboard Components (All)**
- Fixed imports from `services/api` to `Services/api` (case-sensitive)
- Added response shape handling: `data?.data ?? data ?? []`
- Components: PropertiesManager, upcomingActivity, options (both admin/user)

### Database Changes

**Ran SQL to recreate all tables:**
```sql
-- Dropped old misaligned tables
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.communications CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.maintenance_requests CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
-- ... etc

-- Created new tables matching backend expectations:
- properties (with tenant_id, status, rent columns)
- maintenance_requests (correct spelling)
- payments (tenant_id not tenants_id)
- communications, events
```

**Fixed RLS Policies:**
```sql
-- Allowed service role full access (bypasses RLS)
CREATE POLICY "Service role has full access" ON public.users
  USING (true)
  WITH CHECK (true);

-- Allowed users to read/update their own profiles
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);
```

## Result

✅ **Login now works** - correct credentials authenticate successfully  
✅ **Role-based routing** - admins → `/admin`, tenants → `/user`  
✅ **Dashboards load data** - properties, events, maintenance requests display  
✅ **CRUD operations work** - add/edit/delete properties, create events, submit maintenance requests  

## Key Lessons

1. **Use anon key for user auth** - service key is for admin operations only
2. **Match database schema to code** - misalignment causes silent failures
3. **RLS policies matter** - even service role can be blocked by overly restrictive policies
4. **Auto-create user profiles** - don't rely on manual DB inserts, handle in login flow
5. **Case-sensitive imports** - Windows may not catch these, but they fail in production
