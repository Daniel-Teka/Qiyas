const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/userController");
// 'logger' የሚለውን አሁን በ 'auth' ተክተነዋል
const auth = require("../middleware/auth");

// አሁን ጥያቄው ሲመጣ መጀመሪያ auth ይፈትሸዋል፣ ከዚያ ወደ createUser ይሄዳል
router.post("/register", auth, userCtrl.createUser);
// ከላይ ካሉት ጋር ጨምሩት
router.get("/users", userCtrl.getAllUsers);
module.exports = router;
