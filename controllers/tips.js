const User = require("../models/User");
const Tip = require("../models/Tip");
const Comment = require("../models/Comment");

const allTips = (req, res) => {
  Tip.find()
    .sort({ createdAt: -1 })
    .populate("comments")
    .then((foundTips) => {
      res.json(foundTips);
    })
    .catch((err) => {
      console.log(err);
    });
};

const addTip = (req, res) => {
 const { picture, owner, ownerpicture, text, category, location, ownerId } =
   req.body;

   let newTip = {
     picture,
     owner,
     ownerpicture,
     text,
     likes: [],
     comments: [],
     category,
     location,
     ownerId,
   };

  Tip.create(newTip)
    .then((createdTip) => {
      User.findByIdAndUpdate(
        ownerId,
        {
          $push: { tips: createdTip._id },
        },
        { new: true }
      )
        .then((updatedUser) => {
          res.json(updatedUser);
        })
        .catch((err) => {
          console.log({ message: err });
        });
    })
    .catch((err) => {
      console.log({ message: err });
      res.status(500).json({ message: "Internal server error" });
    });
};

const addPicture = (req, res) => {
  res.json(req.file.path);
};

const addComment = (req, res) => {
  const { owner, ownerpicture, text, likes, id} = req.body;
  
    let newComment = { owner, ownerpicture, text, likes };
  Comment.create(newComment)
    .then((newComment) => {
      Tip.findByIdAndUpdate(
        id,
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      )
        .then((updatedTip) => {
          res.json(updatedTip);
        })
        .catch((err) => {
          console.log({ message: err });
          res.status(500).json({ message: "Internal server error" });
        });
    })
    .catch((err) => {
      console.log({ message: err });
      res.status(500).json({ message: "Internal server error" });
    });
};

const addLike = (req, res) => {
  const { userId, tipId } = req.body;

  Tip.findById(tipId)
    .then((tip) => {
      if (!tip) {
        return res.status(404).json({ message: "Tip not found" });
      }
      if (tip.likes.includes(userId)) {
        return res
          .status(400)
          .json({ message: "User has already liked this tip" });
      }

      Tip.findByIdAndUpdate(
        tipId,
        {
          $addToSet: { likes: userId },
        },
        { new: true }
      )
        .then((updatedTip) => {
          res.json(updatedTip);
        })
        .catch((err) => {
          console.log({ message: err });
          res.status(500).json({ message: "Internal server error" });
        });
    })
    .catch((err) => {
      console.log({ message: err });
      res.status(500).json({ message: "Internal server error" });
    });
};

const tipDetail = (req, res) => {
  const { id } = req.params;
  Tip.findById(id)
    .populate("comments")
    .then((foundTip) => {
      res.json(foundTip);
    })
    .catch((err) => {
      console.log({ message: err });
      res.status(500).json({ message: "Internal server error" });
    });
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    res.json(deletedComment);
  } catch (err) {
    console.log({ message: err });
    res.status(500).send("Error deleting comment");
  }
};

const deleteTip = (req, res) => {
  const { id } = req.params;
  Tip.findByIdAndDelete(id)
    .then((deletedTip) => {
      res.json(deletedTip);
    })
    .catch((err) => {
      console.log({ message: err });
      res.status(500).send("Error deleting Tip");
    });
};

const updateTip = async (req, res) => {
  const { id } = req.params;
  const { text, category, picture, location } = req.body;
  try {
    const updatedTip = await Tip.findByIdAndUpdate(
      id,
      { text, category, picture, location },
      { new: true }
    );
    res.json(updatedTip);
  } catch (err) {
    console.log({ message: err });
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  updateTip,
  deleteTip,
  deleteComment,
  tipDetail,
  addLike,
  addComment,
  addPicture,
  addTip,
  allTips,
};
