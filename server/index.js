const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const { StatusCodes } = require("http-status-codes");

// Database Connection
const dbConnection = require("./db/dbConfig");
// for db creation
const database_creation = require("./routes/dbCreationRoute");
app.use("/", database_creation);

app.use(cors());

// json middleware to extract json data
app.use(express.json());

//Importing userRoutes
const userRoutes = require("./routes/userRoute");
// Importing answerRoute
const answerRoute = require("./routes/answerRoute");

//Importing questionRoutes
const questionRoute = require("./routes/questionRoute");
// user route middleware
app.use("/api/users", userRoutes);
// Question route middleware
app.use("/api/question", questionRoute);
// Answers Route middleware
app.use("/api/answers", answerRoute);

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "It is working" });
});

async function start() {
  try {
     app.listen(port);
    console.log("Database Connected Successfully");
    console.log(`Server is Listenning on http://localhost:${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
