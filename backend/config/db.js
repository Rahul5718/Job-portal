const { MongoClient } = require('mongodb');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

let client;
let database;

async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI in backend/.env");
    }

    if (!process.env.DB_NAME) {
      throw new Error("Missing DB_NAME in backend/.env");
    }

    client = client || new MongoClient(process.env.MONGO_URI);
    await client.connect();

    database = client.db(process.env.DB_NAME);

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


module.exports = { connectDB , getDB }