const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

const { createPost, getPosts } = require("../controllers/posts");

router.route("/").get(auth, getPosts).post(auth, createPost);

module.exports = router;
