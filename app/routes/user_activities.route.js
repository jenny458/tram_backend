module.exports = app => {
    const user_activities = require("../controllers/user_activities.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", user_activities.create);
  
    router.get("/", user_activities.findAll);
  
    // router.get("/:id", user_activities.findOne);

    router.get("/reportByDate", user_activities.countByDate);

    router.get("/reportByHour", user_activities.countByHour);

    router.get("/getDateReport", user_activities.getDateReport);

    app.use("/api/user_activities", router);
  };
  