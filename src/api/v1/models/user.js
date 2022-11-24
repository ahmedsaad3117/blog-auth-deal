const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "must provide a email"],
      trim: true,
      unique: true,
      maxlength: [30, "email can not be more than 30 characters"],
      validate(email) {
        if (!validator.isEmail(email)) {
          throw new Error("Invaild Email");
        }
      },
    },

    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timeStamp: true }
);

userSchema.virtual("posts", {
  ref: "Task",
  localField: "_id",
  foreignField: "createdBy",
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email not found");
  }

  const isMatch = password === user.password;
  //const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Wrong password");
  }
  return user;
};

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString(), email: user.email },
    process.env.JWT_TOKEN
  );
  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
