var express = require("express");
var router = express.Router();
const fileUploader = require("../config/cloudinary.config");


const { updateTip, deleteTip, deleteComment, tipDetail, addLike, addComment, addPicture, addTip, allTips } = require("../controllers/tips")

router.get("/all-tips", allTips)

router.post("/add-tip", addTip)

router.post("/add-picture", fileUploader.single("picture"), addPicture )

router.post("/add-comment", addComment )

router.post("/add-like", addLike)

router.get("/tip-detail/:id", tipDetail)

router.get("/comment/delete/:id", deleteComment)

router.get("/tip/delete/:id", deleteTip)

router.post("/tip-detail/:id", updateTip )

module.exports = router;
