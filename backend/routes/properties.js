const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

// GET /api/properties - Admin sees all, tenants see their assigned properties
router.get('/', requireAuth, async (req, res) => {
  try {
    let query = supabase.from('properties').select('*');

    // If not admin, filter by tenant_id
    if (req.user.role !== 'admin') {
      // Get the user's profile to find their ID
      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', req.user.id)
        .single();

      if (!userProfile) {
        return res.status(404).json({ 
          success: false, 
          message: 'User profile not found' 
        });
      }

      query = query.eq('tenant_id', userProfile.id);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET /api/properties/:id - Get specific property
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;

    // If tenant, verify they own this property
    if (req.user.role !== 'admin') {
      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('id', req.user.id)
        .single();

      if (property.tenant_id !== userProfile.id) {
        return res.status(403).json({ 
          success: false, 
          message: 'Unauthorized access' 
        });
      }
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST /api/properties - Create property (admin only)
router.post('/', requireAuth, rbac('admin'), async (req, res) => {
  try {
    const { address, bedrooms, bathrooms, rent, tenant_id } = req.body;

    // Validate required fields
    if (!address || !bedrooms || !bathrooms || !rent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Address, bedrooms, bathrooms, and rent are required' 
      });
    }

    const { data: newProperty, error } = await supabase
      .from('properties')
      .insert([{
        address,
        bedrooms,
        bathrooms,
        rent,
        tenant_id: tenant_id || null
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: newProperty
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT /api/properties/:id - Update property (admin only)
router.put('/:id', requireAuth, rbac('admin'), async (req, res) => {
  try {
    const { address, bedrooms, bathrooms, rent, tenant_id } = req.body;

    const { data: updatedProperty, error } = await supabase
      .from('properties')
      .update({
        ...(address && { address }),
        ...(bedrooms && { bedrooms }),
        ...(bathrooms && { bathrooms }),
        ...(rent && { rent }),
        ...(tenant_id !== undefined && { tenant_id })
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (!updatedProperty) {
      return res.status(404).json({ 
        success: false, 
        message: 'Property not found' 
      });
    }

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE /api/properties/:id - Delete property (admin only)
router.delete('/:id', requireAuth, rbac('admin'), async (req, res) => {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
