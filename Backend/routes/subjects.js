const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");


// ADD SUBJECT
router.post("/add", async (req, res) => {
  try {
    console.log(req.body);
    const { userId, name } = req.body;

    // validation
    if (!userId || !name) {
      return res.status(400).json({ message: "UserId and subject name required" });
    }

    const subject = new Subject({
      userId,
      name
    });

    const savedSubject = await subject.save();

    res.status(201).json(savedSubject);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// GET SUBJECTS OF USER
router.get("/:userId", async (req, res) => {
  try {

    const subjects = await Subject.find({
      userId: req.params.userId
    });

    res.json(subjects);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// DELETE SUBJECT
router.delete("/:id", async (req, res) => {

  try {

    const deleted = await Subject.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ message: "Subject deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }

});

// UPDATE ATTENDANCE
router.put("/update/:id", async (req,res)=>{
  try{

    const {total, attended} = req.body;

    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      { total, attended },
      { returnDocument: "after" }
    );

    res.json(updated);

  }
  catch(err){
    res.status(500).json({error:err.message});
  }
});

module.exports = router;