//Initializing all the required backend content
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const auth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireRole");


//Creates a maintenance request
router.post("/", auth, async (req, res) => {
  const { title, description, property_id } = req.body;
  const tenant_id = req.user.id;

  //Chooses table and data to it
  const { data, error } = await supabase
  .from("maintenance_requests")
  .insert([
    {
      title,
      description,
      property_id,
      tenant_id,
      status: "pending",
    },
  ]);

  // If superbase fails sends error else it is created
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({
     message: "Maintenance request created", data 
    });
});

//User must be logged in then check role then sends database query 
router.get("/", auth, async (req, res) => {
  const role = req.user.role;
  let query = supabase.from("maintenance_requests").select("*");

    if (role === "tenant") {
    query = query.eq("tenant_id", req.user.id);
  }

   const { data, error } = await query;

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});

  //Updates maintenace status , only admins allowed
  router.put("/:id", auth, requireAdmin('admin'), async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const { data, error } = await supabase
    .from("maintenance_requests")
    .update({ status })
    .eq("id", id);  // Update only one row

      if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Status updated", data });
});

  module.exports = router;




