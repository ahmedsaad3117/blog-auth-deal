const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const interactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Interaction type must be provided"],
      enum: ["LIKE", "DISLIKE", "SAD", "ANGRY"],
    },

    post: {
      type: ObjectId,
      ref: "Post",
    },

    comment: {
      type: ObjectId,
      ref: "Comment",
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


interactionSchema.pre("validate", function (next) {
  const interaction = this;
  if (
    (interaction.comment && interaction.post) ||
    (!interaction.comment && !interaction.post)
  ) {
    return next(
      new Error(
        "At least and Only one field(post, comment) for each interaction"
      )
    );
  }
  next();
});

const Interaction = mongoose.model("Interaction", interactionSchema);
module.exports = Interaction;

