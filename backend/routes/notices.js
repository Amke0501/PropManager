const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireRole');

// Create a new notice (Admin only)
router.post("/", auth, requireAdmin('admin'), async (req, res) => {
  const { title, message, priority } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: "Title and message are required" });
  }

  const { data, error } = await supabase
    .from("notices")
    .insert([
      { 
        title, 
        message, 
        priority: priority || 'normal',
        created_by: req.user.id
      }
    ])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({ message: "Notice created", data });
});

// Get all notices
router.get("/", auth, async (req, res) => {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// Delete a notice (Admin only)
router.delete("/:id", auth, requireAdmin('admin'), async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("notices")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "Notice deleted", data });
});

// Mark notice as read (for tenants)
router.post("/:id/read", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Check if already marked as read
  const { data: existing } = await supabase
    .from("notice_reads")
    .select("*")
    .eq("notice_id", id)
    .eq("user_id", userId)
    .single();

  if (existing) {
    return res.json({ message: "Already marked as read" });
  }

  const { data, error } = await supabase
    .from("notice_reads")
    .insert([{ notice_id: id, user_id: userId }]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "Notice marked as read", data });
});

// Get read status for current user
router.get("/read-status", auth, async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("notice_reads")
    .select("notice_id")
    .eq("user_id", userId);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Return array of notice IDs that have been read
  const readNoticeIds = data.map(item => item.notice_id);
  res.json(readNoticeIds);
});

module.exports = router;
