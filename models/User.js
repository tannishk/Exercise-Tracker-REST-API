const mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username:{type:String,unique:true}
});

var User = mongoose.model('User',userSchema);

module.exports = User;
