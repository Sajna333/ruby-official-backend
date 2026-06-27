// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// ✅ Allowed origins — exact matches only (no endsWith tricks)
const allowedOrigins = [
  "https://ruby-official.netlify.app",
  "https://ruby-official-frontend.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

// ✅ CORS options
const corsOptions = {
  origin: function (origin, callback) {
    console.log("🌍 Incoming request from origin:", origin);

    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error("❌ Blocked by CORS:", origin);
    return callback(new Error(`CORS policy does not allow access from: ${origin}`), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// ✅ Apply CORS — must be before all routes
app.use(cors(corsOptions));

// ✅ Handle preflight OPTIONS requests for all routes
app.options("*", cors(corsOptions));

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

// ✅ DEBUG: Check for route file existence and export type
const routeFiles = [
  "products",
  "orders",
  "cart",
  "category",
  "review",
  "contact",
  "auth",
  "user",
  "home",
  "_index_old",
];

for (const name of routeFiles) {
  try {
    const filePath = path.join(__dirname, "routes", `${name}.js`);
    if (fs.existsSync(filePath)) {
      const mod = require(`./routes/${name}`);
      console.log(`🧩 [DEBUG] Route [${name}] type:`, typeof mod, mod.constructor?.name);
    } else {
      console.error(`❌ [DEBUG] Missing route file: ${filePath}`);
    }
  } catch (err) {
    console.error(`❌ [DEBUG] Error loading route [${name}]:`, err.message);
  }
}

// ✅ Routes
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/category", require("./routes/category"));
app.use("/api/review", require("./routes/review"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/home", require("./routes/home"));
app.use("/api/_index_old", require("./routes/_index_old"));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Ruby Official Backend is Live and Running!");
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global error handler — handles CORS errors cleanly
app.use((err, req, res, next) => {
  // CORS errors need a clear 403, not a 500
  if (err.message && err.message.startsWith("CORS policy")) {
    return res.status(403).json({ error: err.message });
  }
  console.error("Global Error:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));