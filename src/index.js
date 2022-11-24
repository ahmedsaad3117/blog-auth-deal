require("express-async-errors");

const express = require("express");

const connectDB = require("./config/dbConnect");
const notFound = require("./api/v1/middlewares/notFound");
const errorHandler = require("./api/v1/middlewares/errorHandler");

const app = express();

const userRoutes = require("./api/v1/routes/users");
const postRoutes = require("./api/v1/routes/posts");

const PORT = 3000 || process.env.PORT;

app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);


app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL_LOCAL_TEST);
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
};

start();
