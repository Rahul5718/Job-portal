
const {
  saveStudentProfile,
  getStudentProfile,
} = require("../models/userProfiles");

const { ObjectId } = require("mongodb");

// GET logged-in student's profile
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;

    if (!userId || !ObjectId.isValid(String(userId))) {
      return res.status(401).json({
        message: "Invalid user ID",
      });
    }

    const profile = await getStudentProfile(
      new ObjectId(String(userId))
    );

    return res.status(200).json({
      success: true,
      profile: profile || null,
    });
  } catch (error) {
    console.error("Profile error:", error);

     return res.status(500).json({
     message: "Could not process student profile",
     error: error.message,
     });
  }
};

// CREATE or UPDATE logged-in student's profile
exports.saveMyProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId || req.user._id;

    if (!userId || !ObjectId.isValid(String(userId))) {
      return res.status(401).json({
        message: "Invalid user ID",
      });
    }

    const profile = await saveStudentProfile(
      new ObjectId(String(userId)),
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Student profile saved successfully",
      profile,
    });
  } catch (error) {
    console.error("Profile error:", error);

     return res.status(500).json({
     message: "Could not process student profile",
     error: error.message,
     });
  }
};
