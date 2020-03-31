// THIS IS THE USER SCHEMA FILE

const mongoose = require('mongoose');

const FrontEndUserSchema = new mongoose.Schema({
  
  username: {
    type: String,
    required: true,
    unique: true
  },

  email:{
    type: String,
  },

  password: {
    type: String,
    required: true
  }
});

module.exports = FrontEndUser = mongoose.model(
  'frontEndUser',
  FrontEndUserSchema
); // takes in model name and schema
