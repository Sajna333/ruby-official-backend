// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "https://ruby-official.netlify.app",
  "https://ruby-official-frontend.vercel.app",
  "https://ruby-official-frontend-q5j839pmu-sajna333s-projects.vercel.app",
  "http://localhost:3000",
];

// ✅ CORS setup (Simplified & Safe)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow Postman / curl
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.error(`❌ Blocked by CORS: ${origin}`);
        return callback(
          new Error(`CORS policy does not allow access from ${origin}`),
          false
        );
      }
    },
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Public uploads folder
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

// ✅ Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/cart", require("./routes/Cart"));
app.use("/api/category", require("./routes/category"));
app.use("/api/review", require("./routes/review"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/auth", require("./routes/User"));

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
  console.error("Global Error:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
