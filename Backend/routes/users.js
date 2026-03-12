const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// REGISTER
router.post("/register", async (req, res) => {

try {

const { name, email, password, role } = req.body;

const hashedPassword = await bcrypt.hash(password, 10);

const newUser = new User({
name,
email,
password: hashedPassword,
role: role ? role : "student"
});

await newUser.save();

res.json({ message: "User registered successfully" });

} catch (error) {

res.status(500).json(error);

}

});

// LOGIN
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json(error);
  }

});

router.get("/students", async (req, res) => {
  try {

    const students = await User.find({ role: "student" });

    res.json(students);

  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;