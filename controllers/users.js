const User = require("../models/User");
const Tip = require("../models/Tip");


const addPicture = (req, res) => {
    res.json(req.file.path);
  }


const editProfile =  async (req, res) => {
  const user = req.params.username;
const { name, email, profile_image, username } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser && existingUser.username !== user) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: user },
      {
        name: name,
        email: email,
        username: username,
        profile_image: profile_image,
      },
      { new: true }
    );

    const updateImage = await Tip.updateMany(
      { owner: user },
      { $set: { ownerpicture: req.body.profile_image } }
    );

    const updateResult = await Tip.updateMany(
      { owner: user },
      { $set: { owner: req.body.username } }
    );

    res.json(updatedUser);
  } catch (err) {
    console.log({message: err.message});
    res.status(500).json({ message: "Server error" });
  }
}


const getProfile = (req, res) => {
  const {username} = req.params;
  User.findOne({ username })
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
};



const profileTips = (req, res) => {
  // This couldnt be destructured it was causing nothing to show up on screen.
  const owner = req.params.username;
  Tip.find({ owner })
    .sort({ createdAt: -1 })
    .then((tip) => {
      res.json(tip);
    })
    .catch((error) => {
      console.error({ message: error });
      res.status(500).json({ message: "Internal server error" });
    });
}


const profileDelete = (req, res) => {
  const { username } = req.params;
  User.findOneAndDelete({ username })
    .then((deletedUser) => {
      res.json(deletedUser);
    })
    .catch((err) => {
      console.log({ message: err.message });
      res.status(500).json({ message: "Internal server error" });
    });
}

module.exports = { profileDelete, profileTips, getProfile, editProfile, addPicture };