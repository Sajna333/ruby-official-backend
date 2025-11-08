// routes/contact.js
const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmails");

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    await sendEmail(name, email, message);
    res.status(200).json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Contact form error:", error.message);
    res.status(500).json({ message: "Failed to send message. Try again later." });
  }
});

module.exports = router;
