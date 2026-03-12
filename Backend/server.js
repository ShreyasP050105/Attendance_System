const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const authRoutes = require("./routes/auth");
const subjectRoutes = require("./routes/subjects");
const adminRoutes = require("./routes/admin");
const User = require("./models/User");
const userRoutes = require("./routes/users");


app.use(express.json());

// Routes AFTER middleware
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

app.get("/",(req,res)=>{
    res.send("API Running");
});

app.listen(5000,()=>{
    console.log("Server running on port 5000");
});