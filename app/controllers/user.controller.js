const db = require("../models");
const logger = require("../config/log.config.js");
const User = db.user;
const Quiz = db.quiz;
const Setting = db.setting;
const UserActivities = db.user_activities;

exports.create = (req, res) => {

  if(!req.body.account_id){
    let message = `user account_id is missing`;
    logger.error(message);
    res.status(400).send(message);
    return;
  }

  User.find({account_id: req.body.account_id})
  .then(data => {
    if(data.length == 0){
      const user = new User({
        account_id: req.body.account_id,
        mobile: req.body.mobile,
        email: req.body.email,
        email_verify: req.body.email_verify,
        profile_url:req.body.profile_url,
        gender: req.body.gender,
        full_name: req.body.full_name,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        jid: req.body.jid,
        avatar: req.body.avatar,
        point: 0,
        chest: 0,
        music: true,
        sound: true,
        caption: req.body.caption,
        status: "online",
        life: 5,
        addLife: false,
        showTutorial: true
      });
    
      user
        .save(user)
        .then(data => {
          let message = `/user has been create with id ${data.id}`;
          logger.info(message);
          const activity = new UserActivities({activity: "LOGIN", user_id:data.id}).save();
          res.send(data);
        })
        .catch(err => {
          let message = `/user ${err} Some error occurred while creating the User`;
          logger.error(message);
          res.status(500).send({
            message:message
          });
        });
    }else{
      const activity = new UserActivities({activity: "LOGIN", user_id:data[0].id}).save();
      const minuteAfterLeft = Math.round( ((new Date().getTime() - data[0].latestLifeTimestamp.getTime()) / 60000 ) )
      const add = Math.round(minuteAfterLeft / 20)
      logger.info(`user has ${data[0].life}`)
      logger.info(`it's been ${minuteAfterLeft} minutes after logout, added ${add} life to user`)
      if( add > 0){
        data[0].life = data[0].life + add
        if(data[0].life > 50){
          data[0].life = 50
        }
        data[0].addLife = false
        data[0].latestLifeTimestamp = new Date()
      }

      User.findByIdAndUpdate(data[0].id, data[0], { useFindAndModify: false, new: true })
      .then(data => {
        if (!data) {
          let message = `user/quiz Cannot update point to user with id=${id}. Maybe user was not found!`;
          logger.error(message);
          res.status(404).send({
            message: message
          });
        } else {
          res.send(data);
        }
      })
      .catch(err => {
        let message = `user/quiz ${err} with id=${data[0].id}`
        logger.error(message);
        res.status(500).send({
          message: message
        });
      });
    }
  })
  .catch(err => {
    let message = `/user ${err} Some error occurred while retrieving Users`;
    logger.error(message);
    res.status(500).send({
      message: message
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
  let select = req.query.point == "true" ? "full_name point -_id" : "full_name profile_url -_id";
  const limit = req.params.limit;
  User.find({}).sort({ 'point': 'desc' }).limit(Number(limit)).select(select)
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

exports.selfRank = (req, res) => {
  const id = req.body.id;
  User.find({}).sort({ 'point': 'desc' }).select('_id')
    .then(data => {
      let message = `/user find user self rank`;
      logger.info(message);
      let index;
      for (var i = 0; i < data.length; i++) {
            if (data[i]._id == id) {
              index = i
              break;
            }
      }
      res.send({ranking: index+1});
    })
    .catch(err => {
      let message = `/user ${err} Some error occurred while retrieving Users`;
      logger.error(message);
      res.status(500).send({
        message: message
      });
    });
};


exports.findToday = (req, res) => {
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


exports.updateUserSetting = (req, res) => {
  if (!req.body) {
    let message = "Data to update can not be empty!";
    logger.error(message);
    return res.status(400).send({
      message: message
    });
  }

  const id = req.body.id;
  if (!id) {
    let message = `user id is missing ${id}`;
    logger.error(message);
    res.status(400).send(message);
    return;
  }

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
  .then(data => {
    if (!data) {
      let message = `user/setting Cannot update point to user with id=${id}. Maybe user was not found!`;
      logger.error(message);
      res.status(404).send({
        message: message
      });
    } else {
      let message = `user/setting user ${id} update setting with id ${req.body}`;
      logger.info(message);
      res.send(data);
    }
  })
  .catch(err => {
    let message = `user/setting ${err} with id=${id}`
    logger.error(message);
    res.status(500).send({
      message: message
    });
  });
};

exports.updateUserLife = (req, res) => {
  if (!req.body) {
    let message = "Data to update can not be empty!";
    logger.error(message);
    return res.status(400).send({
      message: message
    });
  }

  const id = req.body.id;
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
        data.life = data.life+req.body.life;
        if(data.life > 50){
          data.life = 50;
        }

        if(data.life < 50){
          data.latestLifeTimestamp = new Date();
          data.addLife = true;
        }else if(data.life == 50){
          data.addLife = false;
        }
        User.findByIdAndUpdate(id, data, { useFindAndModify: false, new: true })
        .then(data => {
          if (!data) {
            let message = `user/life Cannot update life to user with id=${id}. Maybe user was not found!`;
            logger.error(message);
            res.status(404).send({
              message: message
            });
          } else {
            let message = `user/life user ${id} added ${req.body.life} life, now total life is ${data.life}`;
            logger.info(message);
            res.send(data);
          }
        })
        .catch(err => {
          let message = `user/life ${err} with id=${id}`
          logger.error(message);
          res.status(500).send({
            message: message
          });
        });
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

exports.updateStatusOnline = (req, res) => {
  if (!req.body) {
    let message = "Data to update can not be empty!";
    logger.error(message);
    return res.status(400).send({
      message: message
    });
  }

  const id = req.body.id;
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
        data.status = "online";
        User.findByIdAndUpdate(id, data, { useFindAndModify: false, new: true })
        .then(data => {
          if (!data) {
            let message = `user/login Cannot update life to user with id=${id}. Maybe user was not found!`;
            logger.error(message);
            res.status(404).send({
              message: message
            });
          } else {
            let message = `user/login user ${id} login successfully`;
            logger.info(message);
            res.send({message: message});
            // res.send(data);
          }
        })
        .catch(err => {
          let message = `user/login ${err} with id=${id}`
          logger.error(message);
          res.status(500).send({
            message: message
          });
        });
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

exports.updateStatusOffline = (req, res) => {
  if (!req.body) {
    let message = "Data to update can not be empty!";
    logger.error(message);
    return res.status(400).send({
      message: message
    });
  }

  const id = req.body.id;
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
        data.status = "offline";
        User.findByIdAndUpdate(id, data, { useFindAndModify: false, new: true })
        .then(data => {
          if (!data) {
            let message = `user/login Cannot update life to user with id=${id}. Maybe user was not found!`;
            logger.error(message);
            res.status(404).send({
              message: message
            });
          } else {
            let message = `user/login user ${id} logout successfully`;
            logger.info(message);
            res.send({message: message});
            // res.send(data);
          }
        })
        .catch(err => {
          let message = `user/login ${err} with id=${id}`
          logger.error(message);
          res.status(500).send({
            message: message
          });
        });
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

exports.quizCheckAnswer = (req, res) => {
  const userId = req.body.userId;
  const quizId = req.body.quizId;
  if (!userId) {
    let message = `/quizCheckAnswer userId attribute is missing`;
    logger.error(message);
    res.status(400).send({ message: message });
    return;
  }

  if (!quizId) {
    let message = `/quizCheckAnswer quizId attribute is missing`;
    logger.error(message);
    res.status(400).send({ message: message });
    return;
  }

  Quiz.findById(quizId)
    .then(quiz => {
      if (!quiz){
        let message = `/quizCheckAnswer ${err} Not found Quiz with id ${quizId}.`;
        logger.error(message);
        res.status(404).send({ message: message });
      }else {
        User.findById(userId)
        .then(user => {
          if (!user){
            let message = `Maybe user was not found with id ${userId}`;
            logger.error(message);
            res.status(404).send(message);
          }else{
            let current = new Date().getTime();
            let seconds = (current - user.userQuizTimestamp.getTime()) / 1000;
            if(seconds > quiz.timer){
              let message = `quizCheckAnswer user take too long to answer`;
              logger.info(message);
              res.send({result: "time's up"});
            }else{
              const userChoice = req.body.userChoice;
              if(quiz.answer == userChoice){
                Setting.find({})
                .then(data => {
                  let nz_date_string = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
                  let currentDate = new Date(nz_date_string);
                  logger.info(`currentDate : ${currentDate}`)
                  
                  startDate = new Date(currentDate.getTime());
                  startDate.setHours(data[0].bonus_time_start_hour);
                  startDate.setMinutes(data[0].bonus_time_start_minute);
                  startDate.setSeconds(0);

                  logger.info(`startDate : ${startDate}`)

                  endDate = new Date(currentDate.getTime());
                  endDate.setHours(data[0].bonus_time_end_hour);
                  endDate.setMinutes(data[0].bonus_time_end_minute);
                  endDate.setSeconds(0);

                  logger.info(`endDate : ${endDate}`)

                  validBonusTime = startDate < currentDate && endDate > currentDate

                  logger.info(`valid : ${validBonusTime}`)
                  if(validBonusTime){
                    logger.info(`user on bonus time point x ${data[0].bonus} point`);
                    user.point = user.point+(quiz.point * data[0].bonus);
                    console.log(quiz.point * data[0].bonus)
                    logger.info(`user answer is correct! add ${quiz.point * data[0].bonus} point`);
                  }else{
                    logger.info(`user not on bonus`);
                    user.point = user.point+quiz.point;
                    logger.info("user answer is correct! add 1 point");
                  }

                  User.findByIdAndUpdate(userId, user, { useFindAndModify: false, new: true })
                  .then(data => {
                    if (!data) {
                      let message = `quizCheckAnswer Cannot updateuser with id=${userId}. Maybe user was not found!`;
                      logger.error(message);
                      res.status(404).send({
                        message: message
                      });
                    } else {
                      let message = `quizCheckAnswer user ${userId} updated successfully`;
                      logger.info(message);
                      res.send({result: quiz.answer == userChoice, point:data.point, life: data.life});
                    }
                  })
                  .catch(err => {
                    let message = `user/login ${err} with id=${id}`
                    logger.error(message);
                    res.status(500).send({
                      message: message
                    });
                  });
                })
                .catch(err => {
                  res.status(500).send({
                    message:
                      err.message || "Some error occurred while retrieving Setting."
                  });
                });
              }else{
                user.life = user.life-1;
                user.latestLifeTimestamp = new Date();
                user.addLife = true;
                logger.info("user answer is incorrect! reduce 1 life");
                User.findByIdAndUpdate(userId, user, { useFindAndModify: false, new: true })
                .then(data => {
                  if (!data) {
                    let message = `quizCheckAnswer Cannot updateuser with id=${userId}. Maybe user was not found!`;
                    logger.error(message);
                    res.status(404).send({
                      message: message
                    });
                  } else {
                    let message = `quizCheckAnswer user ${userId} updated successfully`;
                    logger.info(message);
                    res.send({result: quiz.answer == userChoice, point:data.point, life: data.life});
                  }
                })
                .catch(err => {
                  let message = `user/login ${err} with id=${userId}`
                  logger.error(message);
                  res.status(500).send({
                    message: message
                  });
                });
              }
            }
          }
        })
        .catch(err => {
          let message = `${err} Error retrieving User with id ${userId }`;
          logger.error(message);
          res
            .status(500)
            .send({ message: message});
        });
      }
    })
    .catch(err => {
      let message = `/quizCheckAnswer ${err} Error retrieving Quiz with id ${quizId}.`;
      logger.error(message);
      res
        .status(500)
        .send({ message: message });
    });
};


exports.updateTutorial = (req, res) => {
  if (!req.body) {
    let message = "Data to update can not be empty!";
    logger.error(message);
    return res.status(400).send({
      message: message
    });
  }

  const id = req.body.id;
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
        data.showTutorial = false;
        User.findByIdAndUpdate(id, data, { useFindAndModify: false, new: true })
        .then(data => {
          if (!data) {
            let message = `user/tutorial Cannot update life to user with id=${id}. Maybe user was not found!`;
            logger.error(message);
            res.status(404).send({
              message: message
            });
          } else {
            let message = `user/tutorial user ${id} successfully updated showToturial`;
            logger.info(message);
            res.send({message: message});
          }
        })
        .catch(err => {
          let message = `user/tutorial ${err} with id=${id}`
          logger.error(message);
          res.status(500).send({
            message: message
          });
        });
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

