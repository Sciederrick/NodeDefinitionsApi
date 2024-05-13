const {
  validateInsertMany,
  validateGetByTitle,
  validateGetById,
  validateDeleteDefinitions,
} = require("../validate/definition.validate");

const Definition = require("../../../mongo/models/definitions");
const { default: mongoose } = require("mongoose");
const controller = {};

controller.createDefinitions = async (req, res) => {
  try {
    if (!validateInsertMany(req.body)) {
      return res.status(400).json({ message: "Invalid fields", status: 400 });
    }

    const insertedDocs = await Definition.insertMany(req.body);
    return res.status(201).json(insertedDocs);
  } catch (err) {
    console.error(err);
    return res
      .status(err.response?.status || 500)
      .json({ message: err.message || "Something went wrong", status: 500 });
  }
};

controller.getDefinitionByTitle = async (req, res) => {
  try {
    if (!validateGetByTitle(req.params)) {
      return res.status(400).json({ message: "Invalid title", status: 400 });
    }
    const title = req.params.title.trim();
    const definition = await Definition.find({ title: title });
    if (!definition)
      return res
        .status(404)
        .json({ message: `Definition with title: ${title} not found.` });
    return res.status(200).json(definition);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

controller.getDefinitionById = async (req, res) => {
  try {
    if (!validateGetById(req.params)) {
      return res.status(400).json({ message: "Invalid id", status: 400 });
    }
    const id = req.params.id.trim();
    const definition = await Definition.find({ _id: id });
    if (!definition)
      return res
        .status(404)
        .json({ message: `Definition with id: ${id} not found.` });
    return res.status(200).json(definition);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

controller.updateDefinition = async (req, res) => {
  try {
    if (!validateInsertMany(req.body)) {
      return res.status(400).json({ message: "Invalid fields", status: 400 });
    }

    const updatedDefinition = await Definition.findOneAndUpdate(
      { _id: req.body.id.trim() },
      req.body,
      { new: true }
    );
    if (!updatedDefinition)
      return res
        .status(404)
        .json({ message: `Definition not found`, status: 404 });
    return res.status(200).json(updatedDefinition);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

controller.deleteDefinition = async (req, res) => {
  try {
    if (!validateGetById(req.params))
      return res.status(400).json({ message: "Invalid id", status: 400 });

    await Definition.deleteOne({
      _id: req.params.id.trim(),
    });
    return res
      .status(200)
      .json({ message: "Definition deleted successfully", status: 200 });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: 500 });
  }
};

controller.deleteDefinitions = async (req, res) => {
    try {
        const deleteIds = validateDeleteDefinitions(req.body);
        console.log("🚀 ~ controller.deleteDefinitions ~ deleteIds:", deleteIds)
        if (deleteIds.length === 0)
            return res.status(400).json({ message: "Invalid ids", status: 400 });
        
        const bulkOps = deleteIds.map((id) => ({
            deleteOne: { filter: { _id: id } },
        }));

        const resp = await Definition.bulkWrite(bulkOps)
        console.log("🚀 ~ controller.deleteDefinitions ~ resp:", resp)
        
        return res
            .status(200)
            .json({ message: "Definition deleted successfully", status: 200 });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Something went wrong", status: 500 });
    }
};

module.exports = controller;
