require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const redis = require("redis");
const redisConfig = require("./config/redis");
const RateLimit = require("express-rate-limit");
const RateLimitRedis = require("rate-limit-redis");

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(express.json());

    // helmet adiciona headers de segurança para aplicação.
    this.express.use(helmet());

    // pode definir quais as origens de url que a api aceita requisições
    this.express.use(
      cors({
        origin: process.env.URL_FRONT || false,
      })
    );

    // para definir um limite de requisições que um usuário pode fazer em um determinado periodo de tempo sem ser bloqueado pela api.
    if (process.env.NODE_ENV !== "development") {
      this.express.use(
        new RateLimit({
          store: new RateLimitRedis({
            client: redis.createClient(redisConfig),
          }),
          windowMs: 1000 * 60,
          max: 100,
        })
      );
    }

    //connecting to database
    mongoose.connect(
      `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  }

  routes() {
    this.express.use(require("./routes"));
  }
}

module.exports = new AppController().express;
