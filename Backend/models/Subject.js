const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({

  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  name:{
    type:String,
    required:true
  },

  total:{
    type:Number,
    default:0
  },

  attended:{
    type:Number,
    default:0
  }

});

module.exports = mongoose.model("Subject",subjectSchema);