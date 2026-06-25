const mongoose = require("mongoose");

// የዳታቤዝ አወቃቀር (Schema)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ስም ግዴታ ነው
  email: { type: String, unique: true }, // ኢሜይል ድግግሞሽ የለውም
  age: Number, // እድሜ ቁጥር ነው
});

// ይህንን አወቃቀር ወደ "User" ሞዴል እንቀይረዋለን
module.exports = mongoose.model("User", userSchema);
