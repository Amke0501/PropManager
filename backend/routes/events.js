const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireRole');

// Get all events
router.get('/', auth, async (req, res) => {
    try {
        let query = supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        // If user is a tenant, only show their events
        const userRole = req.user.user_metadata?.role || req.user.role || 'tenant';
        if (userRole === 'tenant') {
            query = query.eq('user_id', req.user.id);
        }

        const { data, error } = await query;

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create event (Both users and admins can create)
router.post('/', auth, async (req, res) => {
    try {
        const { title, property, type, date, time, description } = req.body;
        const userRole = req.user.user_metadata?.role || req.user.role || 'tenant';

        const eventData = {
            title,
            property,
            type,
            date,
            time,
            description: description || '',
            user_id: req.user.id,
            created_by: userRole
        };

        const { data, error } = await supabase
            .from('events')
            .insert([eventData])
            .select();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update event
router.put('/:id', auth, requireAdmin, async (req, res) => {
    try {
        const { title, property, type, date, time, description } = req.body;

        const { data, error } = await supabase
            .from('events')
            .update({ title, property, type, date, time, description })
            .eq('id', req.params.id)
            .select();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete event
router.delete('/:id', auth, requireAdmin, async (req, res) => {
    try {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;