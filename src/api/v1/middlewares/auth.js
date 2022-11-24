const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log(authHeader)

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No token provided");
  }

  const token = authHeader.split(" ")[1];
  console.log(token)

  const decoded = jwt.verify(token, process.env.JWT_TOKEN);
  console.log(decoded);

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user =  await User.findOne({
      _id: decoded._id,
      email: decoded.email,
      "tokens.token": token,
    });

    if(!user){
      throw new UnauthenticatedError("Please login again to generate a new token")
    }

    req.user = user;

    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};

module.exports = auth;
