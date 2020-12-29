const db = require("../models");
const logger = require("../config/log.config.js");
const Promotion = db.promotion;


exports.create = (req, res) => {
  const promotion = new Promotion({
    detail: req.body.detail,
    detail_type: req.body.detail_type,
    active: req.body.active
  });

  promotion
    .save(promotion)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Promotion or Reward."
      });
    });
};

exports.findAll = (req, res) => {
  Promotion.find({})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Promotions or Rewards."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "Promotion or Reward id is missing!" });
    return;
  }

  Promotion.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Promotion or Reward with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Promotion or Reward with id=" + id });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "Promotion or Reward id is missing!" });
    return;
  }

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  Promotion.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Promotion or Reward with id=${id}. Maybe Promotion or Reward was not found!`
        });
      } else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Promotion or Reward with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "Promotion or Reward id is missing!" });
    return;
  }

  Promotion.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Promotion or Reward with id=${id}. Maybe Promotion or Reward was not found!`
        });
      } else {
        res.send({
          message: `Promotion or Reward with id=${id} was deleted successfully!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Promotion or Reward with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Promotion.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Promotions and Rewards were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Promotions and Rewards."
      });
    });
};