require("dotenv").config();
require("./models/connection");

const cookieParser = require("cookie-parser");
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

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3001", "http://127.0.0.1:3001"],
    credentials: true,
  })
);

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
app.use(errorHandler);

module.exports = app;
