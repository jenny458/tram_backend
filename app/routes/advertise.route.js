module.exports = app => {
    const advertise = require("../controllers/advertise.controller.js");
  
    var router = require("express").Router();
  
    router.post("/", advertise.create);
  
    router.get("/", advertise.findAll);
  
    router.get("/:id", advertise.findOne);
  
    router.put("/:id", advertise.update);

    router.put("/", advertise.updateAll);
  
    router.delete("/:id", advertise.delete);
  
    router.delete("/", advertise.deleteAll);
  
    app.use("/api/advertise", router);
  };
  