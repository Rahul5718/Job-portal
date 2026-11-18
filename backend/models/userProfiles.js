
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const COLLECTION_NAME = "studentProfiles";

async function saveStudentProfile(userId, profileData) {
  const db = getDB();
  const collection = db.collection(COLLECTION_NAME);

  const allowedFields = [
    "phone",
    "college",
    "university",
    "degree",
    "graduationYear",
    "tenthMarks",
    "twelfthMarks",
    "graduationMarks",
    "preferredJob",
    "preferredLocation",
    "resumeLink",
  ];

  const profile = {};

  allowedFields.forEach((field) => {
    if (profileData[field] !== undefined) {
      profile[field] = profileData[field];
    }
  });

  const objectUserId = new ObjectId(String(userId));

  await collection.updateOne(
    { userId: objectUserId },
    {
      $set: {
        ...profile,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId: objectUserId,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  );

  return await collection.findOne({ userId: objectUserId });
}

async function getStudentProfile(userId) {
  const db = getDB();

  return await db.collection(COLLECTION_NAME).findOne({
    userId: new ObjectId(String(userId)),
  });
}

module.exports = {
  saveStudentProfile,
  getStudentProfile,
};
