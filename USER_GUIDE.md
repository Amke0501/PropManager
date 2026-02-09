# User Guide - PropManager Features

## 🔐 Authentication & User Management

### Sign Up
1. Go to the landing page and click "Sign Up"
2. Enter your details:
   - Email address
   - Password (minimum 6 characters)
   - First name
   - Last name
   - Select role: "Admin" or "Tenant"
3. Click "Sign Up"
4. You'll be logged in automatically

### Login
1. Click "Login" on the landing page
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to your dashboard

### Logout
1. Click the logout button in the Header (top right)
2. You'll be redirected to the landing page

---

## 👤 Profile Management (New Feature)

### Access Profile Settings
1. As a logged-in tenant/user, go to your dashboard
2. Scroll down and look for "Manage Profile" button
3. Click it to open the Profile Settings modal

### Profile Information Tab
1. In the modal, make sure you're on the "Profile Info" tab
2. You can edit:
   - **First Name** - Your first name
   - **Last Name** - Your last name
   - **Phone Number** - Your contact phone
   - **Address** - Your address or property address
3. Email is read-only (cannot be changed)
4. Click "Save Changes" when done
5. You'll see a success message

### Change Password Tab
1. Click on "Password" tab in the modal
2. Enter your new password (minimum 6 characters)
3. Confirm your password by entering it again
4. Click the eye icon to show/hide password
5. Click "Change Password"
6. You'll see a success message
7. You can use your new password for future logins

### Validation Rules
- **Password**: Minimum 6 characters required
- **Password Confirmation**: Must match the new password
- **Phone**: Optional field
- **Address**: Optional field

---

## 📅 Event & Notice Management

### For Admins - Confirming Tenant Notices

**What are notices?**
Notices are calendar events created by tenants that need admin approval.

**How to confirm a notice:**
1. Go to "Upcoming Activity" section on your admin dashboard
2. Look for events with status "pending" that were created by tenants
3. Two action buttons will appear:
   - **Confirm** button (green)
   - **Mark Done** button (gray)
4. Click "Confirm" to approve the notice
5. The status will change from "pending" to "confirmed"
6. The admin who confirmed it will be recorded

**How to mark an event as done:**
1. For any event that is not yet completed, click "Mark Done"
2. The status will change to "completed"
3. The completion timestamp will be recorded
4. Once marked done, you can no longer mark it done again

**Event Status Meanings:**
- **Pending**: Tenant created, waiting for admin approval
- **Confirmed**: Admin approved the notice
- **Completed**: Event is finished/done

### For Tenants - Submitting Notices

1. Go to your tenant dashboard
2. Look for the action cards on the left side
3. Click "Submit Notice"
4. Fill in the notice details:
   - Title: What is the notice about?
   - Description: Additional details
   - Property: Select your property
   - Date: When is the notice for?
   - Time: What time?
5. Click "Submit"
6. Your notice will appear in your calendar with status "pending"
7. Wait for admin to confirm or complete it

---

## 🔧 Maintenance Requests

### Submit a Maintenance Request (Tenant)
1. Go to your dashboard
2. Click "Submit Maintenance Request"
3. Fill in:
   - **Title**: What needs repair? (e.g., "Leaky faucet")
   - **Description**: Details about the problem
   - **Property**: Select your property
   - **Date**: Preferred date for repair
   - **Time**: Preferred time
4. Click "Submit"
5. The request appears in admin dashboard and your calendar

### Track Maintenance Status (Tenant)
1. Check your "Upcoming Activity" calendar
2. Look for events tagged as "maintenance"
3. You can see the request details and status
4. When admin completes it, status will show "completed"

### Manage Maintenance (Admin)
1. Go to admin dashboard
2. Find the Upcoming Activity section
3. See all maintenance requests from tenants
4. Click "Mark Done" to complete a request
5. The tenant will see it as completed

---

## 💳 Payments

### View Payment History (Tenant)
1. Check the "Summary" section on your dashboard
2. Look for payment information
3. Click on payment history to see details

### Record Payments (Admin)
1. Go to admin dashboard
2. Access the Payments section
3. Record new payment received from tenant
4. Payment will be tracked and visible to tenant

---

## 📧 Messages

### Send a Message
1. Click the "Messages" section in your dashboard
2. Find the recipient (admin or tenant)
3. Type your message
4. Click "Send"

### View Message History
1. In the Messages section
2. See all conversations
3. Messages are organized by person

---

## 📊 Admin Reports

### Occupancy Report
1. Go to admin dashboard → Reports
2. View occupancy statistics:
   - Total properties
   - Occupied units
   - Vacant units
   - Maintenance units

### Revenue Report
1. Go to admin dashboard → Reports
2. View financial statistics:
   - Total income
   - Total expenses
   - Net profit
   - Outstanding payments

### View Dashboard Statistics
1. Check the "Activity Overview" card
2. See at a glance:
   - Total properties
   - Available units
   - Occupied units
   - Tenants count
3. Check the "Financial Overview"
4. See:
   - Total income
   - Total expenses
   - Outstanding payments
   - Net profit

---

## 🏠 Property Management (Admin)

### Add a New Property
1. Click "Properties Manager" on admin dashboard
2. Click "+ Add Property"
3. Fill in:
   - **Address**: Property location
   - **Type**: Type of property
   - **Price**: Monthly rent
   - **Status**: Available / Occupied / Maintenance
4. Click "Save"

### Edit a Property
1. Find property in the list
2. Click the edit icon
3. Update details
4. Click "Save Changes"

### Delete a Property
1. Find property in the list
2. Click the delete icon (trash bin)
3. Confirm deletion
4. Property is removed

---

## 👥 Tenant Management (Admin)

### View All Tenants
1. Check the "Summary" section on dashboard
2. See total tenant count
3. Scroll through all tenants

### Assign Tenant to Property
1. Go to tenant management
2. Find the tenant
3. Assign to a property
4. Tenant will see their property in dashboard

---

## ✅ Best Practices

### For Admins:
1. Regularly check pending notices from tenants
2. Confirm or complete events promptly
3. Review maintenance requests regularly
4. Keep payment records updated
5. Generate reports to track occupancy and revenue

### For Tenants:
1. Keep your profile information updated
2. Submit notices and requests clearly with details
3. Check your calendar for admin responses
4. Pay rent on time
5. Report maintenance issues promptly

---

## 🆘 Troubleshooting

### Password Change Not Working
- Make sure password is at least 6 characters
- Confirm password matches exactly
- No special characters limitations
- Clear browser cache if issues persist

### Profile Update Failed
- Check internet connection
- Make sure all required fields are filled
- Try again in a few seconds
- Check if you're still logged in

### Can't Confirm Event
- Make sure you're an admin
- Event must be status "pending"
- Event must be from a tenant (created_by: 'tenant')
- Refresh the page if button doesn't appear

### Can't See Profile Button
- You must be logged in as a tenant
- Scroll down on your dashboard
- Make sure JavaScript is enabled in your browser
- Try logging out and back in

---

## 📞 Support

If you encounter any issues:
1. Check that you're logged in correctly
2. Verify your role (admin vs tenant)
3. Refresh the page
4. Clear browser cache
5. Check browser console for error messages
6. Contact your system administrator

---

## 🔒 Security Notes

- Never share your password with anyone
- Passwords are encrypted and not visible to admins
- Change your password regularly
- Log out when using shared computers
- Keep your profile information up to date
- Report suspicious activity immediately
