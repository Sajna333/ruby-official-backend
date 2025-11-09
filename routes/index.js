const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to Ruby Official API root route");
});

module.exports = router;
