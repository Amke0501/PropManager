const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Supabase client setup
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

// test Supabase connection
app.get('/api/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase.from('PropManager').select('*').limit(1);

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

// end test

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const propertyRoutes = require('./routes/properties');
app.use('/api/properties', propertyRoutes);

// Root route
app.get('/api', (req, res) => {
  res.json({ message: 'PropManager API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
