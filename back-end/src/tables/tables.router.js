const methodNotAllowed = require("../errors/methodNotAllowed"); 
const router = require("express").Router();
const controller = require("./tables.controller");

router
    .route("/:tableId/seat")
    .put(controller.update)
    .delete(controller.delete)
    .all(methodNotAllowed);

router 
    .route("/:tableId")
    .get(controller.read)    
    .all(methodNotAllowed);

router
    .route("/:reservationId")
    .get(controller.list)
    .all(methodNotAllowed);

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);


module.exports = router;