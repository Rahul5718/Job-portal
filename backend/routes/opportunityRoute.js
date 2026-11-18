const router = require("express").Router();

const {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  getAdminOpportunities
} = require("../controller/opportunityController");

const {
  verifyToken,
  isAdmin
} = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllOpportunities);
router.get("/:id", getOpportunityById);

// Admin routes
router.get("/admin/my-opportunities", verifyToken, isAdmin, getAdminOpportunities);
router.post("/", verifyToken, isAdmin, createOpportunity);
router.put("/:id", verifyToken, isAdmin, updateOpportunity);
router.delete("/:id", verifyToken, isAdmin, deleteOpportunity);

module.exports = router;