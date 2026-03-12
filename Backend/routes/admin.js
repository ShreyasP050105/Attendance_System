const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Subject = require("../models/Subject");

router.get("/students", async (req, res) => {
  try {
    const users = await User.find();

    const result = await Promise.all(
      users.map(async (user) => {
        const subjects = await Subject.find({ userId: user._id });

        let totalClasses = 0;
        let attendedClasses = 0;

        subjects.forEach((sub) => {
          totalClasses += sub.total || 0;
          attendedClasses += sub.attended || 0;
        });

        const percentage =
          totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) : "0.00";

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          subjects,
          percentage,
        };
      })
    );

    res.status(200).json({ success: true, students: result });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;