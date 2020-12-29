const db = require("../models");
const logger = require("../config/log.config.js");
const User = db.user;

exports.create = (req, res) => {
  const user = new User({
    account_app: req.body.account_app,
    account_name: req.body.account_name,
    account_photo_url: req.body.account_photo_url,
    avatar: req.body.avatar,
    point: 0,
    sex: req.body.sex,
    age: req.body.age,
    chest: 0,
  });

  user
    .save(user)
    .then(data => {
      let message = `/user has been create with id ${data.id}`;
      logger.info(message);
      res.send(data);
    })
    .catch(err => {
      let message = `/user ${err} Some error occurred while creating the User`;
      logger.error(message);
      res.status(500).send({
        message:message
      });
    });
};

exports.findAll = (req, res) => {
  User.find({})
    .then(data => {
      let message = `/user find all user`;
      logger.info(message);
      res.send(data);
    })
    .catch(err => {
      let message = `/user ${err} Some error occurred while retrieving Users with id ${id}`;
      logger.error(message);
      res.status(500).send({
        message: message
      });
    });
};

exports.findUserQuizzes = (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    let message = `user id is missing ${userId}`;
    logger.error(message);
    res.status(400).send(message);
    return;
  }

  User.findById(userId)
    .then(data => {
      let message = `/user find user quizzes`;
      logger.info(message);
      if(data.quiz && data.quiz.length > 0){
        res.send(data.quiz);
      }else{
        res.send([]);
      }
    })
    .catch(err => {
      let message = `/user ${err} Some error occurred while retrieving Users with id ${id}`;
      logger.error(message);
      res.status(500).send({
        message: message
      });
    });
};

exports.updateUserQuizzes = (req, res) => {
  const id = req.body.userId;
  const quizId = req.body.quizId;
  if (!id) {
    let message = `user id is missing ${id}`;
    logger.error(message);
    res.status(400).send(message);
    return;
  }

  User.findById(id)
  .then(data => {
    if (!data) {
      let message = `user/quiz Cannot update point to user with id=${id}. Maybe user was not found!`;
      logger.error(message);
      res.status(404).send({
        message: message
      });
    } else {
      data.quiz.push(quizId);
      User.findByIdAndUpdate(id, data, { useFindAndModify: false, new: true })
      .then(data => {
        if (!data) {
          let message = `user/quiz Cannot update point to user with id=${id}. Maybe user was not found!`;
          logger.error(message);
          res.status(404).send({
            message: message
          });
        } else {
          let message = `user/quiz user ${id} update quiz with id ${quizId}`;
          logger.info(message);
          res.send({ message : "successfully updated quiz"});
        }
      })
      .catch(err => {
        let message = `user/quiz ${err} with id=${id}`
        logger.error(message);
        res.status(500).send({
          message: message
        });
      });
    }
  })
  .catch(err => {
    let message = `user/quiz ${err} with id=${id}`
    logger.error(message);
    res.status(500).send({
      message: message
    });
  });
};

exports.findByPoint = (req, res) => {
  User.find({}).sort({ 'point': 'desc' }).limit(10)
    .then(data => {
      let message = `/user find all user by point desc`;
      logger.info(message);
      res.send(data);
    })
    .catch(err => {
      let message = `/user ${err} Some error occurred while retrieving Users`;
      logger.error(message);
      res.status(500).send({
        message: message
      });
    });
};


exports.findByDate = (req, res) => {
  let now = new Date();
  let start = new Date(now.getFullYear(),now.getMonth(),now.getDate(),1,0,0);

  let end = new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,59,59);
  User.find({createdAt: {$gte: start, $lt: end} }).sort({ 'createdAt': 'desc' }).limit(10)
    .then(data => {
      let message = `/user find all user by point desc`;
      logger.info(message);
      res.send(data);
    })
    .catch(err => {
      let message = `/user ${err} Some error occurred while retrieving Users`;
      logger.error(message);
      res.status(500).send({
        message: message
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) {
    let message = `user id is missing ${id}`;
    logger.error(message);
    res.status(400).send(message);
    return;
  }

  User.findById(id)
    .then(data => {
      if (!data){
        let message = `Maybe user was not found with id ${id}`;
        logger.error(message);
        res.status(404).send(message);
      }else{
        let message = `user_id ${data}`;
        logger.info(message);
        res.send(data);
      }
    })
    .catch(err => {
      let message = `${err} Error retrieving User with id ${id}`;
      logger.error(message);
      res
        .status(500)
        .send({ message: message});
    });
};
exports.clearQuizzes = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
  .then(data => {
    if (!data) {
      let message = `user/quiz Cannot update point to user with id=${userId}. Maybe user was not found!`;
      logger.error(message);
      res.status(404).send({
        message: message
      });
    } else {
      data.quiz = [];
      User.findByIdAndUpdate(userId, data, { useFindAndModify: false, new: true })
      .then(data => {
        if (!data) {
          let message = `user/quiz Cannot update point to user with id=${userId}. Maybe user was not found!`;
          logger.error(message);
          res.status(404).send({
            message: message
          });
        } else {
          let message = `user/clearQuiz user ${userId} delete all quizzes`;
          logger.info(message);
          res.send({message: "successfully clear all quizzes"});
        }
      })
      .catch(err => {
        let message = `user/quiz ${err} with id=${userId}`
        logger.error(message);
        res.status(500).send({
          message: message
        });
      });
    }
  })
  .catch(err => {
    let message = `user/quiz ${err} with id=${userId}`
    logger.error(message);
    res.status(500).send({
      message: message
    });
  });
}

exports.point = (req, res) => {
  const id = req.body.id;
  if (!id) {
    let message = `user/point id is missing ${id}`;
    logger.error(message);
    res.status(400).send({ message: message });
    return;
  }


  User.findById(id)
    .then(data => {
      if (!data){
        let message = `user/point Not found User with id ${id}`;
        logger.error(message);
        res.status(404).send({ message: message });
      }else {
        if(Math.random() < 0.5){
          let point = 0;
          data.chest = data.chest+1;
          if(data.chest == 2){
            point = 10;
          }else if(data.chest == 10){
            point = 20;
          }else if(data.chest == 50){
            point = 50;
          }else if(data.chest == 100){
            point = 100;
          }else if(data.chest > 100){
            data.chest = 0;
          }
          data.point = data.point + point;
          User.findByIdAndUpdate(id, data, { useFindAndModify: false, new: true })
          .then(data => {
            if (!data) {
              let message = `user/point Cannot update point to user with id=${id}. Maybe user was not found!`;
              logger.error(message);
              res.status(404).send({
                message: message
              });
            } else {
              let message = `user/point user ${id} got ${point} points, now total point is ${data.point}, chest count is ${data.chest}`;
              logger.info(message);
              res.send({ point : point, id: id});
            }
          })
          .catch(err => {
            let message = `user/point ${err} with id=${id}`
            logger.error(message);
            res.status(500).send({
              message: message
            });
          });
        }else{
          let message = `user/point user ${id} got no points, now total point is ${data.point}, chest count is ${data.chest}`;
          logger.info(message);
          res.send({ point : 0, id: id});
        }
      }
    })
    .catch(err => {
      let message = `user/point ${err} with id=${id}`
      logger.error(message);
      res
        .status(500)
        .send({ message: message });
    });
}; 
