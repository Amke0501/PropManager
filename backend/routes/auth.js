// import packages
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const supabase = require('../supabaseClient');

// Use anon key for user password sign-in
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// DEBUG: Test properties endpoint
router.get('/test-properties', async (req, res) => {
  try {
    const { data, error } = await supabase.from('properties').select('*');
    
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching properties',
        error: error.message
      });
    }
    
    res.json({
      success: true,
      count: data.length,
      message: `Found ${data.length} properties in database`,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// POST /api/auth/signup - Register new user with Supabase
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Sign up user with Supabase Auth
    // Use admin API to create user
    const normalizedRole = role === 'user' ? 'tenant' : (role || 'tenant');

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        role: normalizedRole,
        first_name: firstName,
        last_name: lastName
      },
      email_confirm: true  // Auto-confirm email to skip verification
    });

    if (authError) {
      if (authError.code === 'not_admin') {
        return res.status(500).json({
          success: false,
          message: 'Server misconfiguration: SUPABASE_SERVICE_KEY must be the service_role key to create users.'
        });
      }
      if (authError.code === 'email_exists') {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      throw authError;
    }

    // Update user's email_confirmed_at to bypass email verification
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authData.user.id,
      {
        email_confirm: true,
        email_verified_at: new Date().toISOString()
      }
    );
    
    if (updateError) {
      console.warn('Warning: Could not verify email for user:', updateError);
      // Continue anyway - not critical
    }

    // Create user record in database
    const { data: newUser, error: dbError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        first_name: firstName,
        last_name: lastName,
        role: normalizedRole
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // If insert fails, still return success since auth user was created
      // This can happen if user already exists in database
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: {
          id: authData.user.id,
          email: email,
          firstName: firstName,
          lastName: lastName,
          role: normalizedRole
        },
        session: null
      });
      return;
    }

    // Generate a session token for the newly created user
    const { data: sessionData, error: sessionError } = await supabaseAnon.auth.signInWithPassword({
      email,
      password
    });
    
    if (sessionError) {
      console.error('Session creation error:', sessionError);
      // If session creation fails, return user data without session
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          role: newUser.role
        },
        session: null
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role
      },
      session: sessionData
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating user',
      error: error.message 
    });
  }
});

// POST /api/auth/login - User authentication with Supabase
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabaseAnon.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;

    // Get user record from database
    let { data: user, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    // If user profile is missing, create it from auth metadata
    if (dbError) {
      const isNotFound = dbError.code === 'PGRST116' || dbError.status === 406;

      if (!isNotFound) throw dbError;

      const metadata = authData.user.user_metadata || {};
      const fallbackRole = metadata.role === 'user' ? 'tenant' : (metadata.role || 'tenant');

      const { data: createdUser, error: createError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: authData.user.email,
          first_name: metadata.first_name || authData.user.email?.split('@')[0] || 'User',
          last_name: metadata.last_name || 'User',
          role: fallbackRole
        }])
        .select()
        .single();

      if (createError) throw createError;
      user = createdUser;
    }

    const responseRole = user.role === 'user' ? 'tenant' : user.role;

    res.json({
      success: true,
      message: 'Login successful',
      session: authData.session,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: responseRole
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error?.message?.includes('Email not confirmed')
      ? 'Email not confirmed'
      : 'Invalid credentials';
    res.status(401).json({ 
      success: false, 
      message: errorMessage,
      error: error.message 
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error logging out',
      error: error.message 
    });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Get user from Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    // Get user profile from database
    const { data: userProfile, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (dbError) throw dbError;

    res.json({
      success: true,
      user: {
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role: userProfile.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Error fetching user',
      error: error.message 
    });
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Get user from Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    const { firstName, lastName, phone, address } = req.body;

    // Update user profile in database (only update existing columns)
    const { data: updatedUser, error: dbError } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName
      })
      .eq('id', data.user.id)
      .select()
      .single();

    if (dbError) throw dbError;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile',
      error: error.message 
    });
  }
});

// POST /api/auth/change-password - Change user password
router.post('/change-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Get user from Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    // Update password using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      data.user.id,
      { password: newPassword }
    );

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error changing password',
      error: error.message 
    });
  }
});

module.exports = router;
