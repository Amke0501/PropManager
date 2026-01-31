const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireRole');

// Get all events
router.get('/', auth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create event (Admin only)
router.post('/', auth, requireAdmin, async (req, res) => {
    try {
        const { title, property, type, date, time } = req.body;

        const { data, error } = await supabase
            .from('events')
            .insert([{ title, property, type, date, time }])
            .select();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update event (Admin only)
router.put('/:id', auth, requireAdmin, async (req, res) => {
    try {
        const { title, property, type, date, time } = req.body;

        const { data, error } = await supabase
            .from('events')
            .update({ title, property, type, date, time })
            .eq('id', req.params.id)
            .select();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete event (Admin only)
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