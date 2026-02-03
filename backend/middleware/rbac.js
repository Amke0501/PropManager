const supabase = require('../supabaseClient');

/**
 * Role-Based Access Control Middleware
 * @param {string|string[]} allowedRoles - Single role or array of roles allowed to access
 * @returns {Function} Middleware function
 */
const rbac = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Ensure user is authenticated (auth middleware should run first)
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authenticated' 
        });
      }

      // Get user's role from database
      const { data: user, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', req.user.id)
        .single();

      if (error || !user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Convert single role string to array for consistency
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // Check if user's role is in allowed roles
      if (!rolesArray.includes(user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: `Access denied. Required role(s): ${rolesArray.join(', ')}. Your role: ${user.role}` 
        });
      }

      // Store user role in request for later use
      req.user.role = user.role;

      next();
    } catch (error) {
      console.error('RBAC middleware error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error checking permissions',
        error: error.message 
      });
    }
  };
};

module.exports = rbac;
