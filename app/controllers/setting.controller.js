const db = require("../models");
const logger = require("../config/log.config.js");
const Setting = db.setting;


exports.create = (req, res) => {
  const setting = new Setting({
    active: 1,
    // promotion_number: req.body.promotion_number,
    // random_promotion_of_the_day: req.body.random_reward_of_the_day,
    // promotions:req.body.promotions
    bonus: req.body.bonus,
    bonus_time_start_hour: req.body.bonus_time_start_hour,
    bonus_time_start_minute: req.body.bonus_time_start_minute,
    bonus_time_end_hour: req.body.bonus_time_end_hour,
    bonus_time_end_minute: req.body.bonus_time_end_minute
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

exports.getTheme = (req, res) => {
  
  let nz_date_string = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
  let date_ob = new Date(nz_date_string);
  let hour = date_ob.getHours();
  let minute = date_ob.getMinutes();

  if( 
      (hour == 12 && (minute >= 0 && minute <= 59)) ||
      (hour == 13 && (minute >= 0 && minute <= 59)) ||
      (hour == 14) && (minute == 0)
  ){ 
    //12:00 – 14:00
    res.send({theme: "Northern"})
  }else if(
    (hour == 14 && (minute >= 1 && minute <= 59)) ||
    (hour == 15 && (minute >= 0 && minute <= 59)) ||
    (hour == 16) && (minute == 0)
  ){ 
    //14:01 – 16:00
    res.send({theme: "Southern"})
  }else if(
    (hour == 16 && (minute >= 1 && minute <= 59)) ||
    (hour == 17 && (minute >= 0 && minute <= 59)) ||
    (hour == 18) && (minute == 0) ||
    (hour == 22 && (minute >= 1 && minute <= 59)) ||
    (hour == 23 && (minute >= 0 && minute <= 59)) ||
    (hour == 24) && (minute == 0)
  ){
    //16:01 – 18:00 
    //22:01 – 24:00
    res.send({theme: "All"})
  } else if(
    (hour == 18 && (minute >= 1 && minute <= 59)) ||
    (hour == 19 && (minute >= 0 && minute <= 59)) ||
    (hour == 20) && (minute == 0)
  ){
    //18:01 – 20:00
    res.send({theme: "Central"})
  }else if(
    (hour == 20 && (minute >= 1 && minute <= 59)) ||
    (hour == 21 && (minute >= 0 && minute <= 59)) ||
    (hour == 22) && (minute == 0)
  ){
    //20:01 – 22:00
    res.send({theme: "Northeastern"})
  }

};