
const express = require("express");
const cors = require("cors");

const { connectDB, getDB } = require("./config/db");

const app = express();

// Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://job-portal-frontend-six-mu.vercel.app",
].filter(Boolean);

app.use(cors({
   origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}))
app.use(express.json());

// Create required MongoDB collections and indexes
async function createCollections(db) {
  const collectionNames = [
    "users",
    "opportunities",
    "applications",
    "admin",
    "studentProfiles",
  ];

  for (const name of collectionNames) {
    const exists = await db
      .listCollections({ name }, { nameOnly: true })
      .hasNext();

    if (!exists) {
      await db.createCollection(name);
      console.log(`${name} collection created successfully!`);
    }
  }

  await db.collection("users").createIndex(
    { email: 1 },
    { unique: true }
  );

  await db.collection("studentProfiles").createIndex(
    { userId: 1 },
    { unique: true }
  );
}

// Initialize database only once per server instance
let dbInitPromise;

function ensureDatabase() {
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      await connectDB();

      const db = getDB();

      await createCollections(db);

      console.log("Database initialization completed!");
    })().catch((error) => {
      dbInitPromise = null;
      throw error;
    });
  }

  return dbInitPromise;
}

// Connect database before processing API requests
app.use(async (req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (error) {
    console.error("Database initialization error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend connected successfully!",
  });
});

// API routes
app.use("/api/auth", require("./routes/authRoute"));

app.use("/api/opportunities", require("./routes/opportunityRoute"));

app.use("/api/applications", require("./routes/applicationRoute"));

app.use(
  "/api/profile",
  require("./routes/userProfileRoute")
);

// Local development
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  ensureDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Backend startup failed:", error);
      process.exit(1);
    });
}

// Export Express application for Vercel
module.exports = app;
