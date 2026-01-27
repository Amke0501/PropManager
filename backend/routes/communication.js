
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const auth = require('./auth');

router.post("/", auth, async (req, res) => {
  const { receiver_id, message } = req.body;

  const { data, error } = await supabase
    .from("communications")
    .insert([
      { sender_id: req.user.id, receiver_id, message }
    ]);

  res.json(data);
});


router.get("/", auth, async (req, res) => {
  const { data } = await supabase
    .from("communications")
    .select("*")
    .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`);

  res.json(data);
});


