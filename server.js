// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "https://ruby-official.netlify.app", // old Netlify frontend
  "https://ruby-official-frontend.vercel.app", // main Vercel deployment
  "https://ruby-official-frontend-q5j839pmu-sajna333s-projects.vercel.app", // alternate Vercel preview
  "http://localhost:3000", // local dev
];

// ✅ CORS setup (robust version)
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      // Allow requests from server-to-server or tools like Postman
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.error(`❌ CORS blocked: ${origin}`);
      return callback(
        new Error(`CORS policy does not allow access from ${origin}`),
        false
      );
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight requests

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

// ✅ ROUTES
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/cart", require("./routes/Cart"));
app.use("/api/category", require("./routes/category"));
app.use("/api/review", require("./routes/review"));
app.use("/api/contact", require("./routes/contact"));

// 🔑 Auth/User Routes
app.use("/api/auth", require("./routes/User")); // (renamed from Users to User.js)

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
  console.error("Global Error:", err.stack || err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
