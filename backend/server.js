require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const eventRoutes = require('./routes/events');

console.log('Environment check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Found' : 'Missing');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? 'Found' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Found' : 'Missing');


const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);

        if (error) throw error;

        res.json ({
            success: true,
            message: 'Supabase connection successful',
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Supabase connection failed',
            error: error.message
        });
    }
});


app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/communication');
const propertyRoutes = require('./routes/properties');
const maintenanceRoutes = require('./routes/maintenance');
const paymentsRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');
const tenantRoutes = require('./routes/tenants');
const noticeRoutes = require('./routes/notices');

app.use('/api/auth', authRoutes);
app.use('/api/communication',messageRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notices', noticeRoutes);

app.get('/api', (req, res) => {
    res.json({ message: 'PropManager API is running' });
});

// HEALTH CHECK: System status and diagnostics
app.get('/api/health', async (req, res) => {
  const health = {
    status: 'checking',
    timestamp: new Date().toISOString(),
    services: {
      backend: { status: 'ok', message: 'Backend running' },
      supabase: { status: 'checking', message: 'Verifying connection...' },
      properties: { status: 'checking', message: 'Counting records...' },
      users: { status: 'checking', message: 'Checking table...' }
    },
    environment: {
      supabaseUrl: process.env.SUPABASE_URL ? '✓ Configured' : '✗ Missing',
      serviceKey: process.env.SUPABASE_SERVICE_KEY ? '✓ Configured' : '✗ Missing',
      jwtSecret: process.env.JWT_SECRET ? '✓ Configured' : '✗ Missing',
      port: process.env.PORT || 3000
    }
  };

  try {
    // Test Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (testError) {
      health.services.supabase = { 
        status: 'error', 
        message: `Connection failed: ${testError.message}` 
      };
    } else {
      health.services.supabase = { 
        status: 'ok', 
        message: 'Connected successfully' 
      };
    }

    // Count properties
    const { count: propCount, error: propError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });
    
    if (propError) {
      health.services.properties = { 
        status: 'error', 
        message: `Failed: ${propError.message}` 
      };
    } else {
      health.services.properties = { 
        status: propCount > 0 ? 'ok' : 'warning',
        message: `Found ${propCount} properties`,
        count: propCount
      };
    }

    // Count users
    const { count: userCount, error: userError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (userError) {
      health.services.users = { 
        status: 'error', 
        message: `Failed: ${userError.message}` 
      };
    } else {
      health.services.users = { 
        status: 'ok',
        message: `Found ${userCount} users`,
        count: userCount
      };
    }

    // Determine overall status
    const errorCount = Object.values(health.services).filter(s => s.status === 'error').length;
    health.status = errorCount > 0 ? 'degraded' : 'healthy';

    res.json(health);
  } catch (error) {
    health.status = 'error';
    health.error = error.message;
    res.status(500).json(health);
  }
});

// TEST: Get properties without auth
app.get('/api/test/properties', async (req, res) => {
  try {
    console.log('🧪 Test endpoint called: /api/test/properties');
    console.log('   Supabase URL:', process.env.SUPABASE_URL ? 'Configured' : 'Missing');
    console.log('   Service Key:', process.env.SUPABASE_SERVICE_KEY ? 'Configured' : 'Missing');
    
    const { data, error } = await supabase.from('properties').select('*');
    
    if (error) {
      console.error('❌ Test properties error:', error.message);
      console.error('   Code:', error.code);
      console.error('   Details:', error.details);
      throw error;
    }
    
    console.log(`✅ Properties query returned ${data?.length || 0} records`);
    
    if (data.length === 0) {
      console.warn('⚠️  WARNING: Properties table exists but contains no data');
    }
    
    res.json({
      success: true,
      count: data.length,
      message: `Found ${data.length} properties in database`,
      data: data
    });
  } catch (error) {
    console.error('❌ Test properties endpoint error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching test properties',
      error: error.message,
      details: error.details
    });
  }
});

// Starts the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});