// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "https://ruby-official.netlify.app", // Deployed frontend
  "http://localhost:3000",
  "https://ruby-official-frontend.vercel.app",
  "https://ruby-official-frontend-q5j839pmu-sajna333s-projects.vercel.app",             // Local frontend
];

// ✅ CORS setup
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow tools like Postman
    if (!allowedOrigins.includes(origin)) {
      return callback(
        new Error(`CORS policy does not allow access from ${origin}`),
        false
      );
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Public uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
connectDB();

// ✅ ROUTES
// Make sure these route files exist in ./routes/
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/cart", require("./routes/Cart"));
app.use("/api/category", require("./routes/category"));
app.use("/api/review", require("./routes/review"));
app.use("/api/contact", require("./routes/contact"));

// 🔑 Updated Auth/User route (this handles login, register, forgot-password, etc.)
app.use("/api/auth", require("./routes/User")); // 👈 Changed from /api/users to /api/auth

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("🚀 Ruby Official Backend is Live and Running!");
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack || err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
