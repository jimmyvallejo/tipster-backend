var express = require('express');
var router = express.Router();
const fileUploader = require('../config/cloudinary.config')
const User = require('../models/User')
const Tip = require('../models/tip')




router.post('/add-picture', fileUploader.single('profile_image'), (req, res, next) => {
  console.log( "File:" ,req.file)
  res.json(req.file.path)
})




router.post('/profile-edit/:username', async (req, res, next) => {
  const username = req.params.username;
 

  try {
    const existingUser = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });

    if (existingUser && existingUser.username !== username) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const updatedUser = await User.findOneAndUpdate({ username: username },
      {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        profile_image: req.body.profile_image
      },
      { new: true });

      
         const updateImage = await Tip.updateMany(
           { owner: username },
           { $set: { ownerpicture: req.body.profile_image } }
         );

      
      const updateResult = await Tip.updateMany(
         { owner: username },
         { $set: { owner: req.body.username } }
       );
       
    
     console.log(updateResult)
     console.log(updateImage)
     console.log(req.body)
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/profile/:username', (req, res) => {
  const username = req.params.username;
  User.findOne({ username })
  .then(user => {
    // Do something with the user data
    res.json(user);
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  });
});

router.get('/profile/tips/:username', (req, res) => {
  const owner = req.params.username;
  Tip.find({ owner })
  .sort({ createdAt: -1 })
  .then(tip => {
    // Do something with the user data
    res.json(tip);
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  });
});


router.get('/profile/delete/:username', (req, res, next)=> {
  const username = req.params.username;
  User.findOneAndDelete({ username })
  .then((deletedUser) => {
    console.log(deletedUser)
    res.json(deletedUser) 
    console.log("User deleted")
  }).catch((err) => {
      console.log(err)
  })
})






module.exports = router;

