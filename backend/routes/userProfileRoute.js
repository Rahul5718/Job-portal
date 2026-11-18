
const express = require("express");
const router = express.Router();

const {
  getMyProfile,
  saveMyProfile,
} = require("../controller/studentProfileController");

const { verifyToken } = require("../middleware/authMiddleware");

router.get("/me", verifyToken, getMyProfile);
router.put("/me", verifyToken, saveMyProfile);

module.exports = router;
