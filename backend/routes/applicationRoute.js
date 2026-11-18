const router = require("express").Router();

const {
  applyForOpportunity,
  getMyApplications,
  getAdminApplications,
  updateApplicationStatus
} = require("../controller/applicationController");

const {
  verifyToken,
  isAdmin,
  isCandidate
} = require("../middleware/authMiddleware");

// Candidate routes
router.post("/apply", verifyToken, isCandidate, applyForOpportunity);
router.get("/my-applications", verifyToken, isCandidate, getMyApplications);

// Admin routes
router.get("/admin-applications", verifyToken, isAdmin, getAdminApplications);
router.patch("/:id/status", verifyToken, isAdmin, updateApplicationStatus);

module.exports = router;