module.exports = app => {
    const setting = require("../controllers/setting.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", setting.create);
  
    router.get("/", setting.findOne);
  
    // router.get("/:id", setting.findOne);
  
    router.put("/:id", setting.update);
  
    // router.delete("/:id", setting.delete);
  
    // router.delete("/", setting.deleteAll);
  
    app.use("/api/setting", router);
  };
  