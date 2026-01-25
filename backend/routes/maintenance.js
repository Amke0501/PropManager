//Initializing all the required backend content
const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const auth = require("../middleware/auth");

router.post("/",auth, async (req,res) =>{
    const{description, propety_id} = req.body;
    const tenant_id = req.user.id;
    
}
)
