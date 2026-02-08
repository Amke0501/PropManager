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

// Starts the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});