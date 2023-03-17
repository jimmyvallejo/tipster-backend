const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    ownerpicture: String,
    picture: String,
    owner: String,
    text: String,
    likes: Number,
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    category: String
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;