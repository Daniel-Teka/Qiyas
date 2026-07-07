const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/userController");
// 'logger' የሚለውን አሁን በ 'auth' ተክተነዋል
const auth = require("../middleware/auth");

// አሁን ጥያቄው ሲመጣ መጀመሪያ auth ይፈትሸዋል፣ ከዚያ ወደ createUser ይሄዳል
router.post("/register", auth, userCtrl.createUser);
// ከላይ ካሉት ጋር ጨምሩት
router.get("/users", userCtrl.getAllUsers);

// ተጠቃሚን ለማስተካከል (Update)
router.put("/users/:id", auth, userCtrl.updateUser);

// ተጠቃሚን ለመቀየር (Patch)
router.patch("/users/:id", auth, userCtrl.patchUser);

// ተጠቃሚን ለመሰረዝ (Delete)
router.delete("/users/:id", auth, userCtrl.deleteUser);
module.exports = router;
