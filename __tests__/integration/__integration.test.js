const state = require("./state");
const city = require("./city");
const auth = require("./auth");

describe("sequentially run tests", () => {
  state();
  city();
  auth();
});
