const db = require("../models");
const logger = require("../config/log.config.js");
const Setting = db.setting;


exports.create = (req, res) => {
  const setting = new Setting({
    active: 0,
    promotion_number: req.body.promotion_number,
    random_promotion_of_the_day: req.body.random_reward_of_the_day,
    promotions:req.body.promotions
  });

  setting
    .save(setting)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Setting."
      });
    });
};

exports.findAll = (req, res) => {
  Setting.find({})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Setting."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "Setting id is missing!" });
    return;
  }
  Setting.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Setting with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Setting with id=" + id });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "Setting id is missing!" });
    return;
  }

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  Setting.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Setting with id=${id}. Maybe Setting was not found!`
        });
      } else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Setting with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "Setting id is missing!" });
    return;
  }

  Setting.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Setting with id=${id}. Maybe Setting was not found!`
        });
      } else {
        res.send({
          message: `Setting with id=${id} was deleted successfully!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Setting with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Setting.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Setting were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Setting."
      });
    });
};