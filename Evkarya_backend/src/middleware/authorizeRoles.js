const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      try {
        if (!req.user || !roles.includes(req.user.role)) {
          return res.status(403).json({ message: `Access denied for role: '${req.user?.role || "unknown"}'` });
        }
        next();
      } catch (err) {
        return res.status(500).json({ message: "Authorization failed", error: err.message });
      }
    };
  };
  
  module.exports = {authorizeRoles,};
  