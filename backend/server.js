
const express = require("express");
const cors = require("cors");

const { connectDB, getDB } = require("./config/db");

const app = express();

const clean = (u) => (u ? u.trim().replace(/\/$/, "") : "");

const allowedOrigins = [
 "http://localhost:5173",
  "http://localhost:3000",
  "https://job-portal-frontend-six-mu.vercel.app",
  "https://job-portal-frontend-4aov6469y-rathod-dev.vercel.app",
  ...(process.env.FRONTEND_URL||"").split(",").map(clean),
].filter(Boolean);

const corsOptions = {
  origin:(origin, callback) =>{
    if (!origin || allowedOrigins.includes(clean(origin))) {
      return callback(null, true);
    }
    console.log("Blocked CORS origin:", origin);
    return callback(null,false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
let dbInitPromise = null;

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
  res.status(200).json({
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

// HANDLE UNKNOWN ROUTES

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handling
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(error.status || 500).json({
    success: false,
    message: "Internal server error",
  });
});



// Local development
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  ensureDatabase()
    .then(() => {
      app.listen(PORT, "0.0.0.0", () => {
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
