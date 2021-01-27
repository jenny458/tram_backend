const db = require("../models");
const logger = require("../config/log.config.js");
const Quiz = db.quiz;
const User = db.user;


exports.create = (req, res) => {
  const quiz = new Quiz({
    type: req.body.type,
    quiz: req.body.quiz,
    quiz_pic: req.body.quiz_pic,
    choice_type: req.body.choice_type,
    choice_1: req.body.choice_1,
    choice_2: req.body.choice_2,
    answer: req.body.answer,
    timer: req.body.timer,
    point: req.body.point
  });

  quiz
    .save(quiz)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      let message = `/quiz ${err} Some error occurred while creating the Quiz`;
      logger.error(message);
      res.status(500).send({
        message: message
      });
    });
};

exports.findAll = (req, res) => {
  Quiz.find({}).sort({ 'createdAt': 'desc' })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      let message = `/quiz ${err} Some error occurred while retrieving Quizzes.`;
      logger.error(message);
      res.status(500).send({
        message: message
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  if (!id) {
    let message = `/quiz quiz id is missing ${id}`;
    logger.error(message);
    res.status(400).send({ message: message });
    return;
  }

  Quiz.findById(id)
    .then(data => {
      if (!data){
        let message = `/quiz ${err} Not found Quiz with id ${id}.`;
        logger.error(message);
        res.status(404).send({ message: message });
      }else {
        res.send(data);
      }
    })
    .catch(err => {
      let message = `/quiz ${err} Error retrieving Quiz with id ${id}.`;
      logger.error(message);
      res
        .status(500)
        .send({ message: message });
    });
};

exports.random = (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    let message = `/quiz/random userId attribute is missing ${userId}`;
    logger.error(message);
    res.status(400).send({ message: message });
    return;
  }

  User.findById(userId)
    .then(data => {
      let message = `/user find user quizzes`;
      logger.info(message);
      let quizzes = []
      if(data.quiz && data.quiz.length > 0){
        quizzes = data.quiz;
      }

      Quiz.find({ "_id": { "$nin": quizzes } } )
      .then(data => {
        if (!data){
          let message = `/quiz/random ${err} Not found Quiz with id ${userId}.`;
          logger.error(message);
          res.status(404).send({ message: message });
        }else if(data.length == 0){
          let message = `/quiz/random No more Quiz for this User ${userId}`;
          logger.info(message);
          res.send({});
        }else {
          const randomIndex = Math.floor(Math.random() * (data.length - 0) + 0 );
          const randomQuiz = data[randomIndex];
          User.findById(userId)
          .then(data => {
            if (!data) {
              let message = `user/quiz Cannot update point to user with id=${userId}. Maybe user was not found!`;
              logger.error(message);
              res.status(404).send({
                message: message
              });
            } else {
              data.quiz.push(randomQuiz.id);
              data.userQuizTimestamp = new Date();
              User.findByIdAndUpdate(userId, data, { useFindAndModify: false, new: true })
              .then(data => {
                if (!data) {
                  let message = `user/quiz Cannot update point to user with id=${userId}. Maybe user was not found!`;
                  logger.error(message);
                  res.status(404).send({
                    message: message
                  });
                } else {
                  let message = `user/quiz user ${userId} update quiz with id ${randomQuiz.id}`;
                  logger.info(message);
                  res.send({
                    choice_1: randomQuiz.choice_1,
                    choice_2: randomQuiz.choice_2,
                    choice_type: randomQuiz.choice_type,
                    id: randomQuiz.id,
                    point: randomQuiz.point,
                    quiz: randomQuiz.quiz,
                    quiz_pic: randomQuiz.quiz_pic,
                    timer: randomQuiz.timer,
                    type: randomQuiz.type
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
        let message = `/quiz/random ${err} Error retrieving Quiz with id ${userId}.`;
        logger.error(message);
        res
          .status(500)
          .send({ message: message });
      });
      })
    .catch(err => {
      let message = `/user ${err} Some error occurred while retrieving Users with id ${userId}`;
      logger.error(message);
      res.status(500).send({
        message: message
      });
    });


};

exports.update = (req, res) => {
  const id = req.params.id;
  if (!id) {
    let message = `/quiz Quiz id is missing!`;
    logger.error(message);
    res.status(400).send({ message: message });
    return;
  }

  if (!req.body) {
    let message = "Data to update can not be empty!";
    logger.error(message);
    return res.status(400).send({
      message: message
    });
  }

  Quiz.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) {
        let message = `/quiz Cannot update Quiz with id=${id}. Maybe Quiz was not found!`;
        logger.error(message);
        res.status(404).send({
          message: message
        });
      } else res.send(data);
    })
    .catch(err => {
      let message = `/quiz ${err} "Error updating Quiz with id =${id}`;
      logger.error(message);
      res.status(500).send({
        message: message
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  if (!id) {
    let message = `Quiz id is missing!`;
    logger.error(message);
    res.status(400).send({ message: message });
    return;
  }

  Quiz.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        let message = `Cannot delete Quiz with id=${id}. Maybe Quiz was not found!`;
        logger.error(message);
        res.status(404).send({
          message: message
        });
      } else {
        res.send({
          message: `Quiz with id=${id} was deleted successfully!`
        });
      }
    })
    .catch(err => {
      let message = `${err} Could not delete Quiz with id=${id}`;
      logger.error(message);
      res.status(500).send({
        message: message
      });
    });
};

exports.deleteAll = (req, res) => {
  Quiz.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Quizzes were deleted successfully!`
      });
    })
    .catch(err => {
      let message = `${err} Some error occurred while removing all quizzes.`;
      logger.error(message);
      res.status(500).send({
        message: message
      });
    });
};

exports.search = (req, res) => {
  const key = req.body.key;
  const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
  const searchRgx = rgx(key);
  
  Quiz.find({
      $or: [
        { quiz: { $regex: searchRgx, $options: "i" } },
        { choice_1: { $regex: searchRgx, $options: "i" } },
        { choice_2: { $regex: searchRgx, $options: "i" } },
      ],
    })
    .sort({ 'createdAt': 'desc' })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      let message = `${err} Some error occurred while removing all quizzes.`;
      logger.error(message);
      res.status(500).send({
        message: message
      });
    });
};