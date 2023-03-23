const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const signupUser = async (req, res) => {
  try {
    const { email, password, username, name } = req.body;

    if (!email || !password || !username || !name) {
      return res.status(400).json({ message: "Please fill out all fields" });
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPass = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({
      username,
      password: hashedPass,
      email,
      name,
    });
    const payload = {
      _id: createdUser._id,
      email: createdUser.email,
      image: createdUser.profile_image,
      username: createdUser.username,
    };

    const token = jwt.sign(payload, process.env.SECRET, {
      algorithm: "HS256",
      expiresIn: "24hr",
    });

    return res.json({ token, id: createdUser._id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill out both fields" });
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res
        .status(401)
        .json({ message: "Email or Password is incorrect!" });
    }

    const doesMatch = await bcrypt.compare(password, foundUser.password);

    if (doesMatch) {
      const payload = {
        _id: foundUser._id,
        email: foundUser.email,
        image: foundUser.profile_image,
        username: foundUser.username,
      };

      const token = jwt.sign(payload, process.env.SECRET, {
        algorithm: "HS256",
        expiresIn: "24hr",
      });

      return res.json({
        token,
        id: foundUser._id,
        image: foundUser.profile_image,
        message: `Welcome ${foundUser.email}`,
      });
    } else {
      return res
        .status(402)
        .json({ message: "Email or Password is incorrect" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verify = (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = { verify, loginUser, signupUser};
