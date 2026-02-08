const { createClient } = require('@supabase/supabase-js');
const supabase = require("../supabaseClient");

// Use anon key for validating access tokens
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];

  const { data, error } = await supabaseAnon.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = data.user; // ✅ Supabase user

  // Attach role from users table if available (for RBAC/requireRole)
  try {
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (!profileError && userProfile?.role) {
      req.user.role = userProfile.role === 'user' ? 'tenant' : userProfile.role;
    } else {
      const metadataRole = data.user.user_metadata?.role;
      if (metadataRole) {
        req.user.role = metadataRole === 'user' ? 'tenant' : metadataRole;
      }
    }
  } catch (profileLookupError) {
    // Non-fatal: leave role undefined if profile lookup fails
    console.warn('Auth middleware: could not resolve user role', profileLookupError.message);
  }

  next();
};


