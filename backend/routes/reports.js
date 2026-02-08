const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const requireAuth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

/**
 * GET /api/reports/occupancy
 * Returns occupancy statistics (vacant vs occupied properties)
 * Admin only
 */
router.get('/occupancy', requireAuth, rbac('admin'), async (req, res) => {
  try {
    // Get all properties
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('id, tenant_id');

    if (propError) throw propError;

    // Calculate occupancy
    const total = properties.length;
    const occupied = properties.filter(p => p.tenant_id !== null).length;
    const vacant = total - occupied;
    const occupancyRate = total > 0 ? ((occupied / total) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        total,
        occupied,
        vacant,
        occupancyRate: `${occupancyRate}%`,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Occupancy report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating occupancy report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/revenue
 * Returns revenue statistics (total rent collected, by period, etc.)
 * Query params: startDate, endDate (YYYY-MM-DD format)
 * Admin only
 */
router.get('/revenue', requireAuth, rbac('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Get all properties with their rent amounts
    let query = supabase
      .from('properties')
      .select('id, rent, tenant_id, address, created_at');

    const { data: properties, error: propError } = await query;

    if (propError) throw propError;

    // Filter by date if provided
    let filteredProperties = properties;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      filteredProperties = properties.filter(p => {
        const propDate = new Date(p.created_at);
        return propDate >= start && propDate <= end;
      });
    }

    // Calculate revenue metrics
    const totalRent = filteredProperties.reduce((sum, p) => {
      // Only count properties with tenants (occupied)
      return p.tenant_id ? sum + (p.rent || 0) : sum;
    }, 0);

    const occupiedProperties = filteredProperties.filter(p => p.tenant_id !== null);
    const averageRent = occupiedProperties.length > 0
      ? (totalRent / occupiedProperties.length).toFixed(2)
      : 0;

    // Monthly breakdown
    const monthlyRevenue = {};
    filteredProperties.forEach(p => {
      if (p.tenant_id) {
        const date = new Date(p.created_at);
        const monthKey = date.toISOString().substring(0, 7); // YYYY-MM
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (p.rent || 0);
      }
    });

    // Sort monthly data
    const sortedMonthly = Object.entries(monthlyRevenue)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([month, revenue]) => ({ month, revenue }));

    res.json({
      success: true,
      data: {
        totalRent: parseFloat(totalRent.toFixed(2)),
        averageRent: parseFloat(averageRent),
        occupiedProperties: occupiedProperties.length,
        totalProperties: filteredProperties.length,
        monthlyRevenue: sortedMonthly,
        period: startDate && endDate ? `${startDate} to ${endDate}` : 'All time',
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Revenue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating revenue report',
      error: error.message
    });
  }
});

/**
 * GET /api/reports/properties-summary
 * Returns summary of all properties with their tenant info
 * Admin only
 */
router.get('/properties-summary', requireAuth, rbac('admin'), async (req, res) => {
  try {
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .select('*');

    if (propError) throw propError;

    // Enrich with tenant info
    const enriched = await Promise.all(
      properties.map(async (prop) => {
        if (prop.tenant_id) {
          const { data: tenant } = await supabase
            .from('users')
            .select('first_name, last_name, email')
            .eq('id', prop.tenant_id)
            .single();

          return {
            ...prop,
            tenantName: tenant ? `${tenant.first_name} ${tenant.last_name}` : 'Unknown',
            tenantEmail: tenant?.email,
            status: 'Occupied'
          };
        }
        return {
          ...prop,
          tenantName: null,
          tenantEmail: null,
          status: 'Vacant'
        };
      })
    );

    res.json({
      success: true,
      data: enriched
    });
  } catch (error) {
    console.error('Properties summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating properties summary',
      error: error.message
    });
  }
});

module.exports = router;
