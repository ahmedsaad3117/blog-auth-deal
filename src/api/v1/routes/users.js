const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

const { login, adminStatistics } = require("../controllers/users");

router.route("/login").get(login);
router.route("/admin").get(auth, adminStatistics);

module.exports = router;
