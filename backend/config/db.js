const { MongoClient } = require("mongodb");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env"),
});

let client;
let database;

async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI;
    const dbName = process.env.DB_NAME || "opportunityhub";

    console.log("Checking MongoDB configuration...");
    console.log("MONGO_URI exists:", Boolean(mongoURI));
    console.log("DB_NAME exists:", Boolean(dbName));

    if (!mongoURI) {
      throw new Error("MONGO_URI is missing");
    }

    if (!dbName) {
      throw new Error("DB_NAME is missing");
    }

    if (!client) {
      client = new MongoClient(mongoURI, {
        serverSelectionTimeoutMS: 10000,
      });
    }

    await client.connect();

    database = client.db(dbName);
    await database.command({ ping: 1 });

    console.log("MongoDB connected successfully!");

    return database;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

function getDB() {
  if (!database) {
    throw new Error("Database is not connected. Call connectDB() first.");
  }

  return database;
}

module.exports = {
  connectDB,
  getDB,
};
