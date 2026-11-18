
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

class Opportunity {
  constructor(data = {}) {
    Object.assign(this, data);

    const opportunityId = data._id || data.id;

    this._id = opportunityId
      ? (
          opportunityId instanceof ObjectId
            ? opportunityId
            : ObjectId.isValid(String(opportunityId))
              ? new ObjectId(String(opportunityId))
              : opportunityId
        )
      : undefined;

    this.id = opportunityId ? String(opportunityId) : undefined;
  }

  // Add new opportunity
  static async create(data) {
    const db = getDB();

    const opportunity = {
      title: data.title,
      companyName: data.companyName,
      companyEmail:data.companyEmail,
      domain: data.domain,
      employmentType: data.employmentType,
      location: data.location,
      experience: data.experience,
      applicationLink: data.applicationLink,
      applicationDeadline: data.applicationDeadline
        ? new Date(data.applicationDeadline)
        : null,
      description: data.description,
      skills: Array.isArray(data.skills)
        ? data.skills
        : String(data.skills || "")
            .split(",")
            .map(skill => skill.trim())
            .filter(Boolean),

      postedBy: new ObjectId(String(data.postedBy)),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("opportunities").insertOne(opportunity);

    return new Opportunity({
      ...opportunity,
      _id: result.insertedId,
    });
  }

  // Get all opportunities
  static async findAll() {
    const db = getDB();

    const opportunities = await db.collection("opportunities")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return opportunities.map(item => new Opportunity(item));
  }

  // Find opportunity by ID
  static async findById(id) {
    const db = getDB();

    if (!ObjectId.isValid(String(id))) {
      return null;
    }

    const opportunity = await db.collection("opportunities").findOne({
      _id: new ObjectId(String(id)),
    });

    return opportunity ? new Opportunity(opportunity) : null;
  }

  // Update opportunity
  static async update(id, data) {
    const db = getDB();

    if (!ObjectId.isValid(String(id))) {
      return null;
    }

    const allowedFields = [
      "title",
      "companyName",
      "companyEmail",
      "domain",
      "employmentType",
      "location",
      "experience",
      "applicationLink",
      "applicationDeadline",
      "description",
      "skills",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        if (field === "applicationDeadline") {
          updateData[field] = data[field]
            ? new Date(data[field])
            : null;
        } else if (field === "skills") {
          updateData[field] = Array.isArray(data[field])
            ? data[field]
            : String(data[field] || "")
                .split(",")
                .map(skill => skill.trim())
                .filter(Boolean);
        } else {
          updateData[field] = data[field];
        }
      }
    }

    updateData.updatedAt = new Date();

    const result = await db.collection("opportunities").findOneAndUpdate(
      { _id: new ObjectId(String(id)) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return result
      ? new Opportunity(result)
      : null;
  }

  // Delete opportunity
  static async delete(id) {
    const db = getDB();

    if (!ObjectId.isValid(String(id))) {
      return false;
    }

    const result = await db.collection("opportunities").deleteOne({
      _id: new ObjectId(String(id)),
    });

    return result.deletedCount > 0;
  }
}

module.exports = Opportunity
