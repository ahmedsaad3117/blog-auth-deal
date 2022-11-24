const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title body must be provided"],
    },

    body: {
      type: String,
      required: [true, "Post body must be provided"],
    },

    status: {
      type: String,
      enum: ["APPROVED", "PENDING", "REJECTED"],
      default: "PENDING",
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

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

postSchema.virtual("interactions", {
  ref: "Interaction",
  localField: "_id",
  foreignField: "post",
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
