const State = require("../models/State");
const Yup = require("yup");
const Cache = require("../../lib/Cache");

class StateController {
  async index(req, res) {
    var query = {};

    const params = req.body;

    const cached = await Cache.get(`estado:${JSON.stringify(params)}`);

    // verifica se já existe o resultado para consulta em cache
    if (cached) {
      return res.status(200).json({ cached });
    }

    //filtro utiliza cada chave do json enviado como uma propriedade.
    Object.keys(params).forEach((prop) => {
      query[prop] = {
        $regex: params[prop],
        $options: "i", // não diferencia maíusculas
      };
    });

    const states = await State.find(query).sort("name");

    if (states) {
      // adiciona os dados ao cache com expiração de 15 minutos e utilizando os parametros de pesquisa como chaves
      Cache.set(`estado:${JSON.stringify(params)}`, states, 60 * 15);
    }

    return res.status(200).json({ states });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      abbreviation: Yup.string().required().min(2).max(2),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { name, abbreviation } = req.body;

    const state = await State.create({ name, abbreviation });

    Cache.delPrefix("estado");

    return res.status(200).json({ state });
  }

  async update(req, res) {
    // validação do schema
    const schema = Yup.object().shape({
      id: Yup.string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/), //valid id
      name: Yup.string().required(),
      abbreviation: Yup.string().required().min(2).max(2),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { id, name, abbreviation } = req.body;

    const state = await State.findById(id);

    if (!state) {
      return res.status(404).json({ error: "Not found" });
    }

    state.set({ name, abbreviation });

    await state.save();

    Cache.delPrefix("estado");

    return res.status(200).json({ state });
  }

  async delete(req, res) {
    // validação do schema
    const schema = Yup.object().shape({
      id: Yup.string()
        .required()
        .matches(/^[0-9a-fA-F]{24}$/), //Verificando se o id é válido
    });

    if (!(await schema.isValid(req.params))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { id } = req.params;

    const state = await State.findById(id);

    if (!state) {
      return res.status(404).json({ error: "Not found" });
    }

    await State.deleteOne({ _id: id });

    Cache.delPrefix("estado");

    return res.status(200).json({ message: "Deleted" });
  }
}

module.exports = new StateController();
