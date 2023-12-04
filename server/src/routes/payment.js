const router = require("express").Router()

const paymentController = require("../app/controllers/paymentController")
const auth = require("../app/middleware/auth")

router.post("/momo", auth, paymentController.paymentWithMoMo)
router.post("/zalo", auth, paymentController.paymentWithZALO)



module.exports = router
