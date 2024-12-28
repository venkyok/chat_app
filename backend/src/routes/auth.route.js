const express = require("express")

const router = express.Router()

const {protectRoute} = require("../middleware/auth.middleware.js")

const {signup,login,logout,checkAuth,updateProfile} = require("../controllers/auth.controller.js")

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.put("/update-profile",protectRoute, updateProfile)

router.get("/check", protectRoute, checkAuth);

module.exports = router;