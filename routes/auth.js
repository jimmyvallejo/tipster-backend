var express = require("express");
var router = express.Router();

const isAuthenticated = require("../middleware/isAuthenticated");

const { verify, loginUser, signupUser} = require('../controllers/auth')

router.post("/signup", signupUser )

router.post("/login", loginUser);

router.get("/verify", isAuthenticated, verify);

module.exports = router;