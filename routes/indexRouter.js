const Express = require("express");
const route = Express.Router();
const indexController = require("../controller/indexController");

route.get("/", indexController.index)

route.post("/", indexController.post);

route.get("/update/:id", indexController.update)
route.put("/update/:id", indexController.po)
route.delete("/delete/:id", indexController.delete)

module.exports = route