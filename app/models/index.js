const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.quiz = require("./quiz.model.js")(mongoose);
db.advertise = require("./advertise.model.js")(mongoose);
db.user = require("./user.model.js")(mongoose);
db.promotion = require("./promotion.model.js")(mongoose);
db.setting = require("./setting.model.js")(mongoose);
db.user_activities = require("./user_activities.model.js")(mongoose);

module.exports = db;
