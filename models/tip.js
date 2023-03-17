const { Schema, model } = require("mongoose");

const tipSchema = new Schema(
  {
    ownerpicture: String,
    picture: String,
    owner: String,
    text: String,
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    category: String,
    location: String
  },
{
  timeseries: true,
    timestamps: true,
}
);

const Tip = model("Tip", tipSchema);

module.exports = Tip;