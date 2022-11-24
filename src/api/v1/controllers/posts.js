const { ObjectId } = require("mongodb");

const Post = require("../models/post");
const Interaction = require("../models/interaction");

const checkPermissions = require("../helpers/checkPermissions");

const getPosts = async (req, res) => {
  const { _id: userId } = req.user;
  if (req.user.role === "USER") {
    const posts = await Post.aggregate([
      {
        $match: {
          $and: [{ status: "APPROVED" }, { createdBy: ObjectId(userId) }],
        },
      },
      {
        $limit: 10,
      },
    ]);

    await Post.populate(posts, {
      path: "interactions",
      select: "",
      model: Interaction,
    });

    res.status(200).json({ data: posts });
  } else if (req.user.role === "ADMIN") {
    const posts = await Post.aggregate([
      {
        $match: {
          status: "PENDING",
        },
      },
      {
        $limit: 10,
      },
    ]);

    await Post.populate(posts, {
      path: "interactions",
      select: "",
      model: Interaction,
    });

    res.status(200).json({ data: posts });
  }
};


const createPost = async (req, res) => {
  checkPermissions(req.user, "USER");
  const { title, body } = req.body;

  const post = new Post({ title, body, createdBy: req.user._id });
  await post.save();

  res.send(post);
};


module.exports = {
  getPosts,
  createPost,
  
};
