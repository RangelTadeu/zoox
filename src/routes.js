const routes = require("express").Router();

const StateController = require("./app/controllers/StateController");
const CityController = require("./app/controllers/CityController");
// const Brute = require("express-brute");
// const BruteRedis = require("express-brute-redis");
// const redisConfig = require("./config/redis");

const authMiddleware = require("./app/middlewares/auth");

/*
Proteção contra ataque de força bruta para uma rota pode ser implementado com o código abaixo

const bruteStore = new BruteRedis(redisConfig);
const bruteForce = new Brute(bruteStore);
EX:
routes.post("/states", bruteForce.prevent, StateController.store);
 */

routes.use(authMiddleware); //middleware que faz com que as rotas abaixo precisem de autorização

routes.post("/states", StateController.store);

routes.get("/states", StateController.index);
routes.put("/states", StateController.update);

routes.delete("/states/:id", StateController.delete);

// the stateId is required to create a city ex: /5e475d7d23a09430bbf996e7/cities
routes.post("/:id/cities", CityController.store);

routes.get("/cities", CityController.index);
routes.put("/cities", CityController.update);

routes.delete("/cities/:id", CityController.delete);

module.exports = routes;
