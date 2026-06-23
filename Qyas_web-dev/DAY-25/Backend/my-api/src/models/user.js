const mongoose = require("mongoose"); // Fixed spelling to 'mongoose'

// method
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Added missing comma before 'required'
    email: { type: String, unique: true },  // No repeating email
    age: Number,                           // Age is a number
});

// ይህን አወቃቀር ወደ "user" ሞደል እንቀይረዋለን
module.exports = mongoose.model("User", userSchema); // Added missing comma after the model name
