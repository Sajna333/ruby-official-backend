// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "https://ruby-official.netlify.app",
  "https://ruby-official-frontend.vercel.app",
  "http://localhost:3000",
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🌍 Incoming request from origin:", origin);
      if (!origin) return callback(null, true); // Allow Postman / internal

      const allowed = allowedOrigins.some((allowedOrigin) => {
        return (
          origin === allowedOrigin ||
          origin.endsWith(allowedOrigin.replace("https://", ""))
        );
      });

      if (allowed) return callback(null, true);
      console.error("❌ Blocked by CORS:", origin);
      return callback(
        new Error(`CORS policy does not allow access from ${origin}`),
        false
      );
    },
    credentials: true,
  })
);

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connection
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

// ✅ Routes (lowercase paths - Render is case-sensitive)
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/category", require("./routes/category"));
app.use("/api/review", require("./routes/review"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/home",require("./routes/home"));
app.use("/api/_index_old",require("./routes/_index_old"));
// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Ruby Official Backend is Live and Running!");
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
