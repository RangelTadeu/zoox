const City = require("../../src/app/models/City");
const State = require("../../src/app/models/State");
const clear = require("../utils/clear");
const request = require("supertest");
const app = require("../../src/app");

module.exports = () => {
  describe("Cities", () => {
    beforeEach(async () => {
      await clear();
    });

    it("Should filter and list cities", async () => {
      const { name } = await City.create({
        name: "Rio de Janeiro",
      });

      const response = await request(app)
        .get("/cities")
        .send({
          name: "Rio de Janeiro",
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);
      expect(response.status).toBe(200);
    });

    it("Should not create a city with validation fails", async () => {
      const { _id } = await State.create({
        name: "Rio de Janeiro",
        abbreviation: "RJ",
      });

      const response = await request(app)
        .post(`/${_id}/cities`)
        .send({
          name2: "Rio de Janeiro", //name é obrigatório
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(400);
    });

    it("Should not create a city with a state that does not exist", async () => {
      const { _id } = await State.create({
        name: "Rio de Janeiro",
        abbreviation: "RJ",
      });

      await State.deleteOne({ _id: _id });

      const response = await request(app)
        .post(`/${_id}/cities`)
        .send({
          name: "Rio de Janeiro",
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(404);
    });

    it("Should  create a city", async () => {
      const { _id } = await State.create({
        name: "Rio de Janeiro",
        abbreviation: "RJ",
      });

      const response = await request(app)
        .post(`/${_id}/cities`)
        .send({
          name: "Rio de Janeiro",
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(200);
    });

    it("Should not update a city with validation error", async () => {
      const response = await request(app)
        .put("/cities")
        .send({
          //id é obrigatório
          name: "Rio de Janeiro",
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(400);
    });

    it("Should not update a city that does not exist", async () => {
      const { _id } = await State.create({
        name: "Rio de Janeiro",
        abbreviation: "RJ",
      });

      const city = await City.create({
        name: "Rio de Janeiro",
        state: _id,
      });

      await City.deleteOne({ _id: city._id });

      const response = await request(app)
        .put("/cities")
        .send({
          id: city._id,
          name: "Cabo Frio",
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(404);
    });

    it("Should update a city", async () => {
      const { _id } = await State.create({
        name: "Rio de Janeiro",
        abbreviation: "RJ",
      });

      const city = await City.create({
        name: "Rio de Janeiro",
        state: _id,
      });

      const response = await request(app)
        .put("/cities")
        .send({
          id: city._id,
          name: "Cabo Frio",
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(200);
    });

    it("Should not delete a city with validation error on id", async () => {
      const response = await request(app)
        .delete("/cities/f5e7da")
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`); //id fora de padrão

      expect(response.status).toBe(400);
    });

    it("Should not delete a city that does not exist", async () => {
      const { _id } = await State.create({
        name: "Rio de Janeiro",
        abbreviation: "RJ",
      });

      const city = await City.create({
        name: "Rio de Janeiro",
        state: _id,
      });

      await City.deleteOne({ _id: city._id });

      const response = await request(app)
        .delete(`/cities/${city._id}`)
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`); //id fora de padrão

      expect(response.status).toBe(404);
    });

    it("Should  delete a city", async () => {
      const { _id } = await State.create({
        name: "Rio de Janeiro",
        abbreviation: "RJ",
      });

      const city = await City.create({
        name: "Rio de Janeiro",
        state: _id,
      });

      const response = await request(app)
        .delete(`/cities/${city._id}`)
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(200);
    });
  });
};
