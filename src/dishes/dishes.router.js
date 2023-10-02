const router = require("express").Router({ mergeParams: true });
const controller = require("./dishes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /dishes routes needed to make the tests pass

router
.route("/")
.get(controller.list)
.post(controller.create)
.all(methodNotAllowed)

router
.route(":/dishId")
.put(controller.update)
.all(methodNotAllowed)

module.exports = router;
