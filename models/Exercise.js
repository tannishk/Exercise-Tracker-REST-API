const mongoose = require('mongoose');

var exerciseSchema = mongoose.Schema({
  userId:{type:String,required:true},
  description:{type:String,required:true},
  duration:String,
  date: { type: Date, required: true }
});

var Exercise = mongoose.model('Exercise',exerciseSchema);

module.exports = Exercise;

