const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "Post body must be provided"],
    },

    post: {
      type: ObjectId,
      required: true,
      ref: "Post",
    },

    createdBy: {
      type: ObjectId,
      required: [true, "You must login first"],
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.virtual("interactions", {
  ref: "Interaction",
  localField: "_id",
  foreignField: "comment",
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment
