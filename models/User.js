const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    name: String,
    profile_image: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/702/702814.png" 
    },
    location: String,
    tips: [{ type: Schema.Types.ObjectId, ref: "Tips" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const User = model("User", userSchema);
module.exports = User;