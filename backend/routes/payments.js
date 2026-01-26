
// Admin access all data
router.post("/", auth, requireAdmin, async (req, res) => {
  const { tenant_id, amount, month } = req.body;

   const { data, error } = await supabase
    .from("payments")
    .insert([{ tenant_id, amount, month }]);

   if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({ message: "Payment recorded", data });
});

// Access for tenant
router.get("/", auth, async (req, res) => {
  const role = req.user.role;
  let query = supabase.from("payments").select("*");

    if (role === "tenant") {
    query = query.eq("tenant_id", req.user.id);
  }

     const { data, error } = await query;

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
});

