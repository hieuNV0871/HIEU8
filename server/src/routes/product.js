const router = require("express").Router()

const productController = require("../app/controllers/productController")

const auth = require("../app/middleware/auth")
const authEmployee = require("../app/middleware/authEmployee")


router.post("/create", auth, authEmployee, productController.createProduct)
router.patch("/update/:id", auth, authEmployee, productController.updateProduct)

router.get("/getAllProduct", productController.getAllProduct)
router.get("/getProductById/:id",  productController.getProductByID)
router.get("/getProductByCategory/:categoryName", productController.getProductByCategory)
router.get("/search", productController.searchProduct)

router.delete("/delete/:id",auth, authEmployee, productController.deleteOneProduct)
router.delete("/delete_selected/",auth, authEmployee, productController.deleteSelectedProduct)





module.exports = router
