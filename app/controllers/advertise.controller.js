const db = require("../models");
const logger = require("../config/log.config.js");
const Advertise = db.advertise;


exports.create = (req, res) => {
  const adv = new Advertise({
    active: req.body.active,
    active_date: req.body.active_date,
    ordering: req.body.ordering,
    url: req.body.url
  });

  adv
    .save(adv)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Advertise."
      });
    });
};

exports.findAll = (req, res) => {
  Advertise.find({}).sort({ 'ordering': 'asc' })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Advertise."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "Advertise id is missing!" });
    return;
  }

  Advertise.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Advertise with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Advertise with id=" + id });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "Advertise id is missing!" });
    return;
  }

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  Advertise.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Advertise with id=${id}. Maybe Advertise was not found!`
        });
      } else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Advertise with id=" + id
      });
    });
};

exports.updateAll = (req, res) => {
  let hasError = false;
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  req.body.forEach(item => {
    Advertise.findByIdAndUpdate(item.id, item, { useFindAndModify: false})
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Advertise with id=${item.id}. Maybe Advertise was not found!`
        });
      }  
    })
    .catch(err => {
      hasError = true;
    });
  });

  if(hasError){
    res.status(500).send({
      message: "Error updating Advertise with id=" + item.id
    });
  }else{
    res.status(200).send({ message: "Update all success!" });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "Advertise id is missing!" });
    return;
  }

  Advertise.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Advertise with id=${id}. Maybe Advertise was not found!`
        });
      } else {
        res.send({
          message: `Advertise with id=${id} was deleted successfully!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Advertise with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Advertise.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Advertise were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Advertise."
      });
    });
};