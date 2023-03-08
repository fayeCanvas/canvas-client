var express = require("express");
var cors = require("cors");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var compression = require("compression");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth.js");
const patientRoutes = require("./routes/patient");
const goalRoutes = require("./routes/goalRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// DEV ENV w/ Mongo Atlas
console.log(`The mongoose URI is ${process.env.MONGO_URI}`);

mongoose.connect(process.env.MONGO_URI).then(
  () => {
    console.log("connected to local mongoDB");
  },
  (err) => {
    console.log("err", err);
  }
);

const corsOptions = {
  origin: ['https://web-dot-canvas-psych-client-staging.uc.r.appspot.com', 'http://localhost:8080', 'http://canvaspad.org', 'https://canvaspad.org'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.options("*", cors(corsOptions));
app.use(compression());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: false })); // Parses urlencoded bodies

app.use(logger("dev"));

app.use((req, res, next) => {
  const origin = req.get("origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, GET, POST, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-refresh-token, Access-Control-Allow-Credentials"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// routes
app.use("/", authRoutes);
app.use("/", patientRoutes);
app.use("/", goalRoutes);
app.use("/", messageRoutes);

app.use((err, req, res, next) => {
  res.status(422).send({ error: err.message });
});

module.exports = app;

app.listen(process.env.PORT || 5050, function () {
  console.log("Dev app listening on port", process.env.PORT);
});
