const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication token required." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only."
    });
  }

  next();
};

exports.isCandidate = (req, res, next) => {
  if (req.user?.role !== "candidate") {
    return res.status(403).json({
      message: "Access denied. Candidate only."
    });
  }

  next();
};