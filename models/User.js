const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
   username: {
    type: String,
    required: true
  },
   email: {
    type: String,
    required: true
  },
   password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  images:{
     type: String,
     required:true
  }
});

// export model user with UserSchema
module.exports = mongoose.model("users", UserSchema);
