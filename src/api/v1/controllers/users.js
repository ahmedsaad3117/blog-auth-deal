const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Interactions = require("../models/interaction");

const bcrypt = require("bcrypt");

const checkPermissions = require("../helpers/checkPermissions");

const login = async (req, res) => {
  const { email: userEmail, password: userPassword } = req.body;
  const user = await User.findByCredentials(userEmail, userPassword);

  const token = await user.generateToken();

  res.status(200).json({ user, token });
};

const adminStatistics = async (req, res) => {
  checkPermissions(req.user, "ADMIN");

  const penddingPosts = await Post.aggregate([
    { $match: { status: "PENDING" } },
    { $count: "count" },
  ]);
  const approvedPosts = await Post.aggregate([
    { $match: { status: "APPROVED" } },
    { $count: "count" },
  ]);
  const rejectedPosts = await Post.aggregate([
    { $match: { status: "REJECTED" } },
    { $count: "count" },
  ]);
  const totalPosts = await Post.aggregate([
    { $match: {} },
    { $count: "count" },
  ]);
  const totalComments = await Comment.aggregate([
    { $match: {} },
    { $count: "count" },
  ]);
  const totalInteractionsPosts = await Interactions.aggregate([
    { $match: { post: { $exists: true } } },
    { $count: "count" },
  ]);
  const totalInteractionsComments = await Interactions.aggregate([
    { $match: { comment: { $exists: true } } },
    { $count: "count" },
  ]);
  const totalInteractions = await Interactions.aggregate([
    { $match: {} },
    { $count: "count" },
  ]);

  res.json({
    penddingPosts,
    approvedPosts,
    rejectedPosts,
    totalPosts,
    totalComments,
    totalInteractionsPosts,
    totalInteractionsComments,
    totalInteractions,
  });
};


module.exports = {
  login,
  adminStatistics,
};
