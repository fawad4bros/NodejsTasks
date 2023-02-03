const mongoose = require("mongoose");
// const bcrypt = require('bcrypt');
let schema = new mongoose.Schema({
  username: {
    type: String,
    required: "Username is required",
    minlength: 5
  },
  email: {
    type: String,
    required: "Email address is required",
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: "Password is required",
  },
});


const User = mongoose.model("User", schema);
module.exports.User = User;

// Glossary
/*
trim: true
Strings like "  hello", or "hello ", or "  hello ", would end up being saved as "hello"

unique: true,
The unique option for schemas is not a validator. It's a convenient helper for building MongoDB unique indexes
https://mongoosejs.com/docs/validation.html

[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"Please fill a valid email address"]
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 */
