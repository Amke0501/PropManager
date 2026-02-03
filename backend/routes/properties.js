const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { validatePositiveNumber, validateRequiredFields, sanitizeString } = require('../utils/validation');

// GET /api/properties - Admin sees all, tenants see their assigned properties
router.get('/', requireAuth, async (req, res) => {
  try {
    const { status, minRent, maxRent, bedrooms, bathrooms } = req.query;

    let query = supabase.from('properties').select('*');

    // Filter by status (vacant/occupied)
    if (status) {
      if (status.toLowerCase() === 'vacant') {
        query = query.is('tenant_id', true);
      } else if (status.toLowerCase() === 'occupied') {
        query = query.not('tenant_id', 'is', null);
      }
    }

    // Filter by rent range
    if (minRent) {
      const minVal = parseFloat(minRent);
      if (!isNaN(minVal)) {
        query = query.gte('rent', minVal);
      }
    }
    if (maxRent) {
      const maxVal = parseFloat(maxRent);
      if (!isNaN(maxVal)) {
        query = query.lte('rent', maxVal);
      }
    }

    // Filter by bedrooms
    if (bedrooms) {
      const beds = parseInt(bedrooms);
      if (!isNaN(beds)) {
        query = query.eq('bedrooms', beds);
      }
    }

    // Filter by bathrooms
    if (bathrooms) {
      const baths = parseInt(bathrooms);
      if (!isNaN(baths)) {
        query = query.eq('bathrooms', baths);
      }
    }

    const { data, error } = await query;

    if (error) throw error;

    // If not admin, filter by tenant_id
    let filteredData = data;
    if (req.user.role !== 'admin') {
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

      filteredData = data.filter(p => p.tenant_id === userProfile.id);
    }

    res.json({
      success: true,
      count: filteredData.length,
      data: filteredData
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching properties',
      error: error.message 
    });
  }
});

// GET /api/properties/:id - Get specific property
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const propertyId = sanitizeString(req.params.id);

    const { data: property, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ 
          success: false, 
          message: 'Property not found' 
        });
      }
      throw error;
    }

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
    console.error('Get property error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching property',
      error: error.message 
    });
  }
});

// POST /api/properties - Create property (admin only)
router.post('/', requireAuth, rbac('admin'), async (req, res) => {
  try {
    const { address, bedrooms, bathrooms, rent, tenant_id } = req.body;

    // Validate required fields
    const validation = validateRequiredFields({ address, bedrooms, bathrooms, rent }, 
      ['address', 'bedrooms', 'bathrooms', 'rent']);
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Validate numbers
    const bedroomVal = validatePositiveNumber(parseInt(bedrooms), 'Bedrooms');
    if (!bedroomVal.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: bedroomVal.error
      });
    }

    const bathroomVal = validatePositiveNumber(parseInt(bathrooms), 'Bathrooms');
    if (!bathroomVal.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: bathroomVal.error
      });
    }

    const rentVal = validatePositiveNumber(parseFloat(rent), 'Rent');
    if (!rentVal.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: rentVal.error
      });
    }

    // Sanitize address
    const sanitizedAddress = sanitizeString(address);

    const { data: newProperty, error } = await supabase
      .from('properties')
      .insert([{
        address: sanitizedAddress,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        rent: parseFloat(rent),
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
    console.error('Create property error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating property',
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
