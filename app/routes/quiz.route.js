module.exports = app => {
    const quiz = require("../controllers/quiz.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", quiz.create);
  
    router.get("/", quiz.findAll);
  
    router.get("/:id", quiz.findOne);

    router.post('/random', quiz.random);
  
    router.put("/:id", quiz.update);
  
    router.delete("/:id", quiz.delete);
  
    router.delete("/", quiz.deleteAll);

    router.post("/search", quiz.search)
  
    app.use("/api/quiz", router);
  };
  