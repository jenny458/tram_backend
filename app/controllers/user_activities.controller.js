const db = require("../models");
const logger = require("../config/log.config.js");
const User_Activities = db.user_activities;


exports.create = (req, res) => {
  const user_activities = new User({
    user_id: req.body.user_id,
    activity: req.body.activity,
  });

  user_activities
    .save(user_activities)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    });
};

exports.findAll = (req, res) => {
  User_Activities.find({})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).send({ message: "User id is missing!" });
    return;
  }

  User_Activities.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found User with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving User with id=" + id });
    });
};

exports.countByDate = (req, res) => {
  User_Activities.aggregate([
    { 
      $match: { activity: "LOGIN" }
    },
    {
      $group: {
          _id: {
            day: {
              $dayOfMonth: "$createdAt"
            },
            month: {
              $month: "$createdAt"
            },
            year: {
              $year: "$createdAt"
            },
            user_id: "$user_id",
          }
      }
    },
    { 
      $project : { 
        day: "$_id.day",
        month: "$_id.month",
        year: "$_id.year",
      } 
    },
    {
      $group: {
          _id: {
            day: "$day",
            month: "$month",
            year: "$year",
          },
          count: {
              $sum: 1
          },
      }
    },
    { $sort: { "_id.month": 1, "_id.day": 1 } }
  ], (error, count) => {
      if (error) {
          logger.error(error);
          res
            .status(500)
            .send({ message: "Error retrieving User_Activities"});
      } else {
        logger.info("Retrieved count user by date");
        res.send(count);
      }
  });
};

exports.countByHour = (req, res) => {
  User_Activities.aggregate([
    { 
      $match: { activity: "LOGIN" }
    },
    {
      $group: {
          _id: {
            day: {
              $dayOfMonth: "$createdAt"
            },
            month: {
              $month: "$createdAt"
            },
            year: {
              $year: "$createdAt"
            },
            hour: {
              $hour: "$createdAt"
            },
            user_id: "$user_id",
          }
      }
    },
    { 
      $project : { 
        day: "$_id.day",
        month: "$_id.month",
        year: "$_id.year",
        hour: "$_id.hour"
      } 
    },
    {
      $group: {
          _id: {
            day: "$day",
            month: "$month",
            year: "$year",
            hour: "$hour"
          },
          count: {
              $sum: 1
          },
      }
    },
    { $sort: { "_id.month": 1, "_id.day": 1, "_id.hour": 1 } }
  ], (error, count) => {
      if (error) {
          logger.error(error);
          res
            .status(500)
            .send({ message: "Error retrieving User_Activities"});
      } else {
        logger.info("Retrieved count user by date");
        res.send(count);
      }
  });
};


exports.getDateReport = (req, res) => {
  User_Activities.aggregate([
    { 
      $match: { activity: "LOGIN" }
    },
    {
      $group: {
          _id: {
            day: {
              $dayOfMonth: "$createdAt"
            },
            month: {
              $month: "$createdAt"
            },
            year: {
              $year: "$createdAt"
            }
          }
      }
    },
    { $sort: { "_id.month": 1, "_id.day": 1} }
  ], (error, count) => {
      if (error) {
          logger.error(error);
          res
            .status(500)
            .send({ message: "Error retrieving User_Activities"});
      } else {
        logger.info("Retrieved count user by date");
        res.send(count);
      }
  });
};