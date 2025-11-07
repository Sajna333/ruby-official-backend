// routes/contact.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // ✅ create transporter using Gmail or SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL, // admin email
        pass: process.env.ADMIN_PASS,  // app password (not your Gmail password)
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL, // send to admin
      subject: `New Contact Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Failed to send message. Try again later." });
  }
});

module.exports = router;
