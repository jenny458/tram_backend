module.exports = app => {
    const user = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", user.create);
  
    router.get("/", user.findAll);

    router.get("/point/:limit", user.findByPoint);

    router.get("/today", user.findByDate);

    router.get("/:id/quiz", user.findUserQuizzes)

    router.put("/quiz", user.updateUserQuizzes)

    router.put("/:id/cleaQuiz", user.clearQuizzes)
  
    router.get("/:id", user.findOne);

    router.put("/setting", user.updateUserSetting);

    router.put("/point", user.point)

    router.put("/life", user.updateUserLife);

    router.put("/login", user.updateStatusOnline);

    router.put("/logout", user.updateStatusOffline);

    app.use("/api/user", router);
  };
  