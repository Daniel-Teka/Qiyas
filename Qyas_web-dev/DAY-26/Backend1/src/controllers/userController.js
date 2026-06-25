// src/controllers/userController.js

// ትክክለኛው የፋይል መንገድ (path) መሆኑን ያረጋግጡ
// '../models/User' ማለት ከአሁኑ ፋይል ወጣ ብሎ ወደ models አቃፊ ሂድ ማለት ነው
const User = require("../models/User");

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.log("የዳታቤዝ ስህተት:", error);
    res.status(400).json({ message: "ስህተት ተፈጥሯል", details: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // ሁሉንም ተጠቃሚዎች ከዳታቤዝ ያመጣል
    res.status(200).json(users); // ያገኘውን መረጃ ለተጠቃሚው ይልካል
  } catch (error) {
    res.status(500).json({ message: "መረጃውን ማምጣት አልተቻለም" });
  }
};

