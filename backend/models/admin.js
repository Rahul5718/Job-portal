
const { getDB } = require("../config/db");

class Admin {
  constructor(data = {}) {
    Object.assign(this, data);

    this.id = data.id || (
      data._id ? String(data._id) : undefined
    );
  }

  static async findByEmail(email) {
    if (!email) return null;

    const db = getDB();

    const admin = await db.collection("admin").findOne({
      email: email.trim().toLowerCase(),
    });

    return admin ? new Admin(admin) : null;
  }

  static async findById(id) {
    if (!id) return null;

    const { ObjectId } = require("mongodb");

    if (!ObjectId.isValid(id)) return null;

    const db = getDB();

    const admin = await db.collection("admin").findOne({
      _id: new ObjectId(id),
    });

    return admin ? new Admin(admin) : null;
  }
}

module.exports = Admin;
