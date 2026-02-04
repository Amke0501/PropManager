// import packages
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

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
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {},
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
        role: role || 'tenant'
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
          role: role || 'tenant'
        },
        session: null
      });
      return;
    }

    // Generate a session token for the newly created user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession(authData.user.id);
    
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
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw authError;

    // Get user record from database
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (dbError) throw dbError;

    res.json({
      success: true,
      message: 'Login successful',
      session: authData.session,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials',
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

module.exports = router;
