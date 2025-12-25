const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
   
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
       
        return res.status(401).json({ message: "Unauthorized: Token expired or invalid", error: err.message });
      }

    
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
  }
};

module.exports = {authenticate,};
