const userController = require("../app/controllers/userController")
const router = require("express").Router()
const auth = require("../app/middleware/auth")
const authAdmin = require("../app/middleware/authAdmin")


router.get("/info", auth, userController.getUserInfo)
router.get("/all_user", auth, authAdmin, userController.getAllUser)
router.post("/add_to_cart", auth, userController.addToCart)
router.post("/create", auth, authAdmin, userController.createUser)
router.patch("/update", auth, userController.updateUser)
router.patch("/update_permission/:id", auth, authAdmin, userController.updateUserPermission)
router.patch("/update_cart_item", auth, userController.updateCartItem)


router.delete("/delete/:id", auth, userController.deleteUser)
router.delete("/delete_from_cart/:id", auth , userController.deleteCartItem)





module.exports = router