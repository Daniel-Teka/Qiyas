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
// ተጠቃሚን ለማስተካከል (Update - ሙሉውን መረጃ ለመቀየር)
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) return res.status(404).json({ message: "ተጠቃሚው አልተገኘም" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "ማስተካከል አልተቻለም", details: error.message });
  }
};

// ተጠቃሚን ለማስተካከል (Patch - የተወሰነውን መረጃ ብቻ ለመቀየር)
exports.patchUser = async (req, res) => {
  try {
    // $set በመጠቀም የላክነውን መስክ ብቻ እናስተካክላለን
    const patchedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    if (!patchedUser) return res.status(404).json({ message: "ተጠቃሚው አልተገኘም" });
    res.status(200).json(patchedUser);
  } catch (error) {
    res.status(400).json({ message: "መቀየር አልተቻለም", details: error.message });
  }
};

// ተጠቃሚን ለመሰረዝ (Delete)
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "ተጠቃሚው አልተገኘም" });
    res.status(200).json({ message: "ተጠቃሚው በተሳካ ሁኔታ ተሰርዟል" });
  } catch (error) {
    res.status(500).json({ message: "መሰረዝ አልተቻለም" });
  }
};
