module.exports = app => {
    const promotion = require("../controllers/promotion.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", promotion.create);
  
    router.get("/", promotion.findAll);
  
    router.get("/:id", promotion.findOne);
  
    router.put("/:id", promotion.update);
  
    router.delete("/:id", promotion.delete);
  
    router.delete("/", promotion.deleteAll);
  
    app.use("/api/promotion", router);
  };
  