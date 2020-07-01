const City = require("../models/City");
const State = require("../models/State");
const Yup = require("yup");
const Cache = require("../../lib/Cache");

class CityController {
  async index(req, res) {
    var query = {};

    const params = req.body;

    const cached = await Cache.get(`cidade:${JSON.stringify(params)}`);

    // verifica se já existe o resultado para consulta em cache
    if (cached) {
      return res.status(200).json({ cached });
    }

    //filtro utiliza cada chave do json enviado como uma propriedade.
    Object.keys(params).forEach((prop) => {
      query[prop] = {
        $regex: params[prop],
        $options: "i", // não diferencia maiúsculas
      };
    });

    const cities = await City.find(query).populate("state").sort("name");

    if (cities) {
      // adiciona os dados ao cache com expiração de 15 minutos e utilizando os parametros de pesquisa como chaves
      Cache.set(`cidade:${JSON.stringify(params)}`, cities, 60 * 15);
    }

    return res.status(200).json({ cities });
  }

  async store(req, res) {
    // validação do schema
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { name } = req.body;

    const state = await State.findById(req.params.id);

    if (!state) {
      return res.status(404).json({ error: "Not found" });
    }

    const city = await City.create({
      name,
      state: state._id,
    });

    Cache.delPrefix("cidade");

    return res.status(200).json({ city });
  }

  async update(req, res) {
    // validação do schema
    const schema = Yup.object().shape({
      id: Yup.string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/), // verifica se é um id válido
      name: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { id, name } = req.body;

    const city = await City.findById(id);

    if (!city) {
      return res.status(404).json({ error: "Not found" });
    }

    city.set({ name });

    await city.save();

    Cache.delPrefix("cidade");

    return res.status(200).json({ city });
  }

  async delete(req, res) {
    // validação do schema
    const schema = Yup.object().shape({
      id: Yup.string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/), // verifica se é um id válido
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { id } = req.params;

    const city = await City.findById(id);

    if (!city) {
      return res.status(404).json({ error: "Not found" });
    }

    await City.deleteOne({ _id: id });

    Cache.delPrefix("cidade");

    return res.status(200).json({ message: "Deleted" });
  }
}
module.exports = new CityController();
