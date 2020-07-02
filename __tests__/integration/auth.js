const clear = require("../utils/clear");
const request = require("supertest");
const app = require("../../src/app");

module.exports = () => {
  describe("Cities", () => {
    beforeEach(async () => {
      await clear();
    });

    it("Should not access a private route without a token", async () => {
      const response = await request(app).get(`/states`);

      expect(response.status).toBe(401);
    });

    it("Should not access a private route with an invalid token", async () => {
      const response = await request(app)
        .get(`/states`)
        .set("Authorization", `Bearer INVALID`);

      expect(response.status).toBe(401);
    });
  });
};
