const router = require("express").Router()

const ordersController = require("../app/controllers/ordersController")
const auth = require("../app/middleware/auth")
const authEmployee = require("../app/middleware/authAdmin")

router.post("/create", ordersController.createOrders)
router.get("/getAll", auth, authEmployee, ordersController.getAllOrders)
router.get("/getPersonalOrders", auth, ordersController.getPersonalOrders)
router.patch("/updatePersonalOrders/:id", auth, ordersController.updatePersonalOrders)
router.patch("/update/:id", auth, authEmployee, ordersController.updateOrders)
router.patch("/cancel/:id", auth, ordersController.cancellationOrders)

//check middleware payment neu k phai admin
// router.patch("/update_Orders_status/:id", auth, , ordersController.updateStatusOrders) 
router.delete("/delete/:id", auth, ordersController.deleteOneOrders)


module.exports = router
