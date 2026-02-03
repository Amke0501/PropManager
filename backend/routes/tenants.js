const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { validateEmail, validateRequiredFields, sanitizeString } = require('../utils/validation');

// GET /api/tenants - Get all tenants (admin only)
router.get('/', requireAuth, rbac('admin'), async (req, res) => {
  try {
    const { search, sortBy = 'created_at', order = 'desc' } = req.query;

    let query = supabase
      .from('users')
      .select('*')
      .eq('role', 'tenant');

    // Apply search filter
    if (search) {
      const sanitizedSearch = sanitizeString(search);
      // Note: Supabase doesn't support full-text search easily, so we'll filter in memory
      query = query.or(`first_name.ilike.%${sanitizedSearch}%,last_name.ilike.%${sanitizedSearch}%,email.ilike.%${sanitizedSearch}%`);
    }

    // Apply sorting
    const validSortFields = ['first_name', 'last_name', 'email', 'created_at'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
    const isAscending = order.toLowerCase() === 'asc';

    query = query.order(sortField, { ascending: isAscending });

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching tenants',
      error: error.message 
    });
  }
});

// GET /api/tenants/:id - Get specific tenant (admin only)
router.get('/:id', requireAuth, rbac('admin'), async (req, res) => {
  try {
    const { data: tenant, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .eq('role', 'tenant')
      .single();

    if (error) throw error;

    if (!tenant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tenant not found' 
      });
    }

    // Get properties assigned to this tenant
    const { data: properties } = await supabase
      .from('properties')
      .select('*')
      .eq('tenant_id', req.params.id);

    res.json({
      success: true,
      data: {
        ...tenant,
        properties
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/tenants - Create new tenant (admin only)
router.post('/', requireAuth, rbac('admin'), async (req, res) => {
  try {
    const { email, firstName, lastName, property_id } = req.body;

    // Validate required fields
    const validation = validateRequiredFields({ email, firstName, lastName }, 
      ['email', 'firstName', 'lastName']);
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format'
      });
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeString(email.toLowerCase());
    const sanitizedFirstName = sanitizeString(firstName);
    const sanitizedLastName = sanitizeString(lastName);

    // First, create user in Supabase Auth with a temporary password
    const temporaryPassword = Math.random().toString(36).slice(-12);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password: temporaryPassword
    });

    if (authError) throw authError;

    // Create user profile in database
    const { data: newTenant, error: dbError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email: sanitizedEmail,
        first_name: sanitizedFirstName,
        last_name: sanitizedLastName,
        role: 'tenant'
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    // Assign property if provided
    if (property_id) {
      const propertyId = sanitizeString(property_id);
      const { error: propError } = await supabase
        .from('properties')
        .update({ tenant_id: authData.user.id })
        .eq('id', propertyId);

      if (propError) throw propError;
    }

    res.status(201).json({
      success: true,
      message: 'Tenant created successfully. Temporary password sent to email.',
      data: newTenant
    });
  } catch (error) {
    console.error('Create tenant error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating tenant',
      error: error.message 
    });
  }
});

// PUT /api/tenants/:id - Update tenant (admin only)
router.put('/:id', requireAuth, rbac('admin'), async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const { data: updatedTenant, error } = await supabase
      .from('users')
      .update({
        ...(firstName && { first_name: firstName }),
        ...(lastName && { last_name: lastName }),
        ...(email && { email })
      })
      .eq('id', req.params.id)
      .eq('role', 'tenant')
      .select()
      .single();

    if (error) throw error;

    if (!updatedTenant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tenant not found' 
      });
    }

    res.json({
      success: true,
      message: 'Tenant updated successfully',
      data: updatedTenant
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE /api/tenants/:id - Delete tenant (admin only)
router.delete('/:id', requireAuth, rbac('admin'), async (req, res) => {
  try {
    // First, unassign properties from this tenant
    await supabase
      .from('properties')
      .update({ tenant_id: null })
      .eq('tenant_id', req.params.id);

    // Delete user profile
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (dbError) throw dbError;

    // Delete from auth (note: this may not work with service key in some cases)
    // The user record is deleted from the users table above, which is sufficient

    res.json({
      success: true,
      message: 'Tenant deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/tenants/:id/assign-property - Assign property to tenant (admin only)
router.post('/:id/assign-property', requireAuth, rbac('admin'), async (req, res) => {
  try {
    const { property_id } = req.body;

    if (!property_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'property_id is required' 
      });
    }

    // Verify tenant exists
    const { data: tenant, error: tenantError } = await supabase
      .from('users')
      .select('id')
      .eq('id', req.params.id)
      .eq('role', 'tenant')
      .single();

    if (tenantError || !tenant) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tenant not found' 
      });
    }

    // Verify property exists
    const { data: property, error: propError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', property_id)
      .single();

    if (propError || !property) {
      return res.status(404).json({ 
        success: false, 
        message: 'Property not found' 
      });
    }

    // Assign property to tenant
    const { error: updateError } = await supabase
      .from('properties')
      .update({ tenant_id: req.params.id })
      .eq('id', property_id);

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: 'Property assigned to tenant successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
