require("dotenv").config();
require("./models/connection");

const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const errorHandler = require("./middlewares/error");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const spotifyRouter = require("./routes/spotify");
const discogsRouter = require("./routes/discogs");
const quizRouter = require("./routes/quiz");
const blindtestRouter = require("./routes/blindtest");
const tracksRouter = require("./routes/tracks");

const app = express();

// CORS
app.use(
  cors({
    origin: ["http://localhost:3001", "http://127.0.0.1:3001"],
    credentials: true,
  })
);

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.CONNECTION_STRING }),
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  })
);

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false },
//   })
// );

// Options Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Music City",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};
// Génère le document OpenAPI
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/spotify", spotifyRouter);
app.use("/discogs", discogsRouter);
app.use("/quiz", quizRouter);
app.use("/blindtest", blindtestRouter);
app.use("/tracks", tracksRouter);

app.use(errorHandler);

module.exports = app;
