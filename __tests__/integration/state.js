const request = require("supertest");
const app = require("../../src/app");
const State = require("../../src/app/models/State");
const clear = require("../utils/clear");

module.exports = () => {
  describe("States", () => {
    beforeEach(async () => {
      await clear();
    });

    it("Should not create a state with validation fails", async () => {
      const response = await request(app)
        .post("/states")
        .send({
          name: "Rio de Janeiro",
          abbreviation: "RJJ", //Não permite mais de 2 caracteres
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(400);
    });

    it("Should  create a state", async () => {
      const response = await request(app)
        .post("/states")
        .send({
          name: "Rio de Janeiro",
          abbreviation: "RJ",
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(200);
    });

    it("Should not update a state with validation error", async () => {
      const response = await request(app)
        .put("/states")
        .send({
          //id é obrigatório
          abbreviation: "RJ",
          name: "Rio de Janeiro",
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(400);
    });

    it("Should not update a state that does not exist", async () => {
      const { _id } = await State.create({
        name: "Rio de Janeiro",
        abbreviation: "RJ",
      });

      await State.deleteOne({ _id: _id });

      const response = await request(app)
        .put("/states")
        .send({
          id: _id,
          abbreviation: "RJ",
          name: "Rio de Janeiro",
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(404);
    });

    it("Should  update a state", async () => {
      const { _id } = await State.create({
        name: "RIO DE JANEIRO",
        abbreviation: "RJ",
      });

      const response = await request(app)
        .put("/states")
        .send({
          id: _id,
          abbreviation: "RJ",
          name: "Rio de Janeiro",
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(200);
    });

    it("Should not delete a state with validation error on id", async () => {
      const response = await request(app)
        .delete("/states/4787k")
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`); //id fora de padrão

      expect(response.status).toBe(400);
    });

    it("Should not delete a state that does not exist", async () => {
      const { _id } = await State.create({
        name: "Rio de Janeiro",
        abbreviation: "RJ",
      });

      await State.deleteOne({ _id: _id });

      const response = await request(app)
        .delete(`/states/${_id}`)
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`); //id fora de padrão

      expect(response.status).toBe(404);
    });

    it("Should  delete a state", async () => {
      const { _id } = await State.create({
        name: "Rio de Janeiro",
        abbreviation: "RJ",
      });

      const response = await request(app)
        .delete(`/states/${_id}`)
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);

      expect(response.status).toBe(200);
    });

    it("Should filter and list states", async () => {
      const { name, abbreviation } = await State.create({
        name: "Rio de Janeiro",
        abbreviation: "RJ",
      });

      const response = await request(app)
        .get("/states")
        .send({
          abbreviation: abbreviation,
          name: name,
        })
        .set("Authorization", `Bearer ${process.env.APP_SECRET}`);
      expect(response.status).toBe(200);
    });
  });
};
