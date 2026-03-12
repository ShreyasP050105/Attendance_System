const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");
const Subject = require("./models/Subject");

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await User.find();
        console.log("Total Users:", users.length);
        console.log("Users:", users.map(u => ({ name: u.name, role: u.role, id: u._id })));

        const subjects = await Subject.find();
        console.log("Total Subjects:", subjects.length);
        console.log("Subjects:", subjects.map(s => ({ userId: s.userId, name: s.name })));

        mongoose.connection.close();
    } catch (err) {
        console.error("FULL ERROR:", err);
    }
}

checkDB();
