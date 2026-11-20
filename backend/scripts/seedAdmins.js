
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const bcrypt = require("bcryptjs");
const { connectDB, getDB } = require("../config/db");

async function seedAdmins() {
  try {
    await connectDB();

    const db = getDB();
    const adminCollection = db.collection("admin");

    // Ensure admin email is unique
    await adminCollection.createIndex(
      { email: 1 },
      { unique: true }
    );

    // Read all admin accounts from environment variables
    const admins = [
      {
        name: process.env.ADMIN_1_NAME,
        email: process.env.ADMIN_1_EMAIL,
        password: process.env.ADMIN_1_PASSWORD,
      },
      {
        name: process.env.ADMIN_2_NAME,
        email: process.env.ADMIN_2_EMAIL,
        password: process.env.ADMIN_2_PASSWORD,
      },
      {
        name: process.env.ADMIN_3_NAME,
        email: process.env.ADMIN_3_EMAIL,
        password: process.env.ADMIN_3_PASSWORD,
      },
    ];

    for (const admin of admins) {
      if (!admin.name || !admin.email || !admin.password) {
        throw new Error(
          "An admin environment variable is missing."
        );
      }

      const email = admin.email.trim().toLowerCase();

      // Check whether admin already exists
      const existingAdmin = await adminCollection.findOne({
        email,
      });

      if (existingAdmin) {
        console.log(`Admin already exists: ${email}`);
        continue;
      }

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(
        admin.password,
        12
      );

      await adminCollection.insertOne({
        name: admin.name.trim(),
        email,
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`Admin created successfully: ${email}`);
    }

    console.log("All admin accounts processed successfully!");

  } catch (error) {
    console.error("Admin initialization failed:", error);
    process.exitCode = 1;
  }
}

seedAdmins().finally(() => {
  // End this one-time script after database operations
  process.exit();
});
