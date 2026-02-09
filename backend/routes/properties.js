const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const { validatePositiveNumber, validateRequiredFields, sanitizeString } = require('../utils/validation');

// TEST ENDPOINT - Get all properties without auth (for debugging)
router.get('/test/all-properties', async (req, res) => {
  try {
    const { data, error } = await supabase.from('properties').select('*');
    
    if (error) throw error;
    
    res.json({
      success: true,
      count: data.length,
      message: `Found ${data.length} properties in database`,
      data: data
    });
  } catch (error) {
    console.error('Test properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties from test endpoint',
      error: error.message
    });
  }
});

// GET /api/properties - Admin sees all, tenants see their assigned properties
router.get('/', requireAuth, async (req, res) => {
  try {
    const { status, minRent, maxRent, bedrooms, bathrooms } = req.query;

    let query = supabase.from('properties').select('*');

    // Filter by status (available/occupied/maintenance)
    if (status) {
      const statusLower = status.toLowerCase();
      const normalizedStatus = statusLower === 'vacant' ? 'available' : statusLower;
      const validStatuses = ['available', 'occupied', 'maintenance'];

      if (validStatuses.includes(normalizedStatus)) {
        query = query.eq('status', normalizedStatus);
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

    // Return all properties for dropdown (no filtering by tenant_id)
    // This allows users to submit notices/requests for any property
    res.json({
      success: true,
      count: data.length,
      data: data
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
    const { name, address, rent, status } = req.body;

    // Validate required fields
    const validation = validateRequiredFields({ name, address, rent, status }, 
      ['name', 'address', 'rent', 'status']);
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Validate rent is a positive number
    const rentVal = validatePositiveNumber(parseFloat(rent), 'Rent');
    if (!rentVal.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: rentVal.error
      });
    }

    // Validate status is either 'available', 'occupied', or 'maintenance'
    const statusLower = status.toLowerCase();
    const normalizedStatus = statusLower === 'vacant' ? 'available' : statusLower;
    const validStatuses = ['available', 'occupied', 'maintenance'];
    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status must be one of: available, occupied, or maintenance'
      });
    }

    // Sanitize strings
    const sanitizedName = sanitizeString(name);
    const sanitizedAddress = sanitizeString(address);

    const { data: newProperty, error } = await supabase
      .from('properties')
      .insert([{
        name: sanitizedName,
        address: sanitizedAddress,
        rent: parseFloat(rent),
        status: normalizedStatus,
        tenant_id: null
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
    const { name, address, rent, status, tenant_id } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (name) updateData.name = sanitizeString(name);
    if (address) updateData.address = sanitizeString(address);
    if (rent) {
      const rentVal = validatePositiveNumber(parseFloat(rent), 'Rent');
      if (!rentVal.isValid) {
        return res.status(400).json({ 
          success: false, 
          message: rentVal.error
        });
      }
      updateData.rent = parseFloat(rent);
    }
    if (status) {
      const statusLower = status.toLowerCase();
      const normalizedStatus = statusLower === 'vacant' ? 'available' : statusLower;
      const validStatuses = ['available', 'occupied', 'maintenance'];
      if (!validStatuses.includes(normalizedStatus)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Status must be one of: available, occupied, or maintenance'
        });
      }
      updateData.status = normalizedStatus;
    }
    if (tenant_id !== undefined) updateData.tenant_id = tenant_id;

    const { data: updatedProperty, error } = await supabase
      .from('properties')
      .update(updateData)
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
