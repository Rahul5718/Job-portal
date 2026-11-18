
const bcrypt = require("bcryptjs");
const { connectDB, getDB } = require("../config/db");

class Admin {
  constructor(data = {}) {
    Object.assign(this, data);
    this.id = data.id || (data._id ? String(data._id) : undefined);
  }

  static async findByEmail(email) {
    if (!email) return null;

    const db = getDB();
    const admin = await db.collection("admin").findOne({
      email: email.toLowerCase().trim()
    });

    return admin ? new Admin(admin) : null;
  }
}

async function createAdmin() {
  try {
    await connectDB();

    const db = getDB();

    const adminEmail = process.env.ADMIN_EMAIL.toLowerCase().trim();

    const existingAdmin = await db.collection("admin").findOne({
      email: adminEmail
    });

    if (existingAdmin) {
      console.log("Admin account already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await db.collection("admin").insertOne({
      name: process.env.ADMIN_NAME,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log("Admin account created successfully!");

  } catch (error) {
    console.error("Admin creation failed:", error);

  } finally {
    process.exit();
  }
}

module.exports = Admin;

if (require.main === module) {
  createAdmin();
}
