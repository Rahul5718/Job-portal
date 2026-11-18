
const express = require("express");
const { connectDB, getDB } = require("./config/db");
const cors = require('cors')

const app = express()

// Middleware
app.use(express.json())

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL
  ]
}));


app.get('/api/test', (req, res) => {
    res.json({
        message: "Backend connected successfully!"
    });
});

app.use("/api/auth", require("./routes/authRoute"))

app.use("/api/opportunities", require("./routes/opportunityRoute"));

app.use("/api/applications", require("./routes/applicationRoute"));
const studentProfileRoutes = require("./routes/userProfileRoute");

app.use("/api/profile", studentProfileRoutes);

async function createCollections(db){
     const collectionNames = [
          "users",
          "opportunities",
          "applications",
          "admin",
          "userProfile"
     ]

     for (const name of collectionNames) {
    const exists = await db.listCollections(
      { name },
      { nameOnly: true }
    ).hasNext();

    if (!exists) {
      await db.createCollection(name);
      console.log(`${name} collection created successfully!`);
    } else {
      console.log(`${name} collection already exists.`);
    }
  }

   await db.collection("users").createIndex(
    { email: 1 },
    { unique: true }
  );

  await db.collection("userProfile").createIndex(
    { userId: 1 },
    { unique: true }
  );

}


const PORT =  process.env.PORT || 5000

// Start server after database connection
async function startServer() {
  try {
    await connectDB();

    const db = getDB()

    await createCollections(db)

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Backend startup failed:", error);
  }
}


startServer();
