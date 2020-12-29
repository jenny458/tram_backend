module.exports = app => {
    const user_activities = require("../controllers/user_activities.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", user_activities.create);
  
    router.get("/", user_activities.findAll);
  
    router.get("/:id", user_activities.findOne);
  
    app.use("/api/user_activities", router);
  };
  