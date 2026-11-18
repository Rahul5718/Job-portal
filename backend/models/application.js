
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

class Application {

  // Constructor
  constructor(data = {}) {
    Object.assign(this, data);

    const applicationId = data._id || data.id;

    this._id = applicationId
      ? (applicationId instanceof ObjectId
          ? applicationId
          : ObjectId.isValid(String(applicationId))
            ? new ObjectId(String(applicationId))
            : applicationId)
      : undefined;

    this.id = applicationId ? String(applicationId) : undefined;
  }

  // Create application when candidate applies
  static async create(data) {
    const db = getDB();

    const application = {
      userId: new ObjectId(data.userId),
      opportunityId: new ObjectId(data.opportunityId),
      adminId: new ObjectId(data.adminId),

      resume: data.resume || "",
      coverLetter: data.coverLetter || "",
      applicant: data.applicant || {},

      status: data.status || "submitted",

      applicationDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection("applications")
      .insertOne(application);

    return new Application({
      ...application,
      _id: result.insertedId
    });
  }

  // Find applications submitted by a candidate
  static async findByUserId(userId) {
    if (!ObjectId.isValid(String(userId))) return [];

    const db = getDB();

    const applications = await db.collection("applications")
      .find({
        userId: new ObjectId(userId)
      })
      .toArray();

    return applications.map(app => new Application(app));
  }

  // Find applications for a particular opportunity
  static async findByOpportunityId(opportunityId) {
    if (!ObjectId.isValid(String(opportunityId))) return [];

    const db = getDB();

    const applications = await db.collection("applications")
      .find({
        opportunityId: new ObjectId(opportunityId)
      })
      .toArray();

    return applications.map(app => new Application(app));
  }

  // Find application by its ID
  static async findById(id) {
    if (!ObjectId.isValid(String(id))) return null;

    const db = getDB();

    const application = await db.collection("applications")
      .findOne({
        _id: new ObjectId(id)
      });

    return application ? new Application(application) : null;
  }

  // Admin views applications received for their opportunities
  static async findByAdmin(adminId) {
    if (!ObjectId.isValid(String(adminId))) return [];

    const db = getDB();

    return await db.collection("applications")
      .aggregate([
        {
          $match: {
            adminId: new ObjectId(adminId)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "candidate"
          }
        },
        {
          $lookup: {
            from: "opportunities",
            localField: "opportunityId",
            foreignField: "_id",
            as: "opportunity"
          }
        },
        {
          $unwind: {
            path: "$candidate",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind: {
            path: "$opportunity",
            preserveNullAndEmptyArrays: true
          }
        }
      ])
      .toArray();
  }

  // Candidate views their submitted applications
  static async findByUser(userId) {
    if (!ObjectId.isValid(String(userId))) return [];

    const db = getDB();

    return await db.collection("applications")
      .aggregate([
        {
          $match: {
            userId: new ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: "opportunities",
            localField: "opportunityId",
            foreignField: "_id",
            as: "opportunity"
          }
        },
        {
          $unwind: {
            path: "$opportunity",
            preserveNullAndEmptyArrays: true
          }
        }
      ])
      .toArray();
  }
}

module.exports = Application;
