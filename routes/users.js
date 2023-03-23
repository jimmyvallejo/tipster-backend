var express = require("express");
var router = express.Router();
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User");
const Tip = require("../models/Tip");

const { profileDelete, profileTips, getProfile, editProfile, addPicture } = require('../controllers/users')

router.post("/add-picture", fileUploader.single("profile_image"), addPicture)
  

router.post("/profile-edit/:username", editProfile)

router.get("/profile/:username", getProfile)

router.get("/profile/tips/:username", profileTips)

router.get("/profile/delete/:username", profileDelete)

module.exports = router;
