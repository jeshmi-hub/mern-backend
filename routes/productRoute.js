const express = require('express')
const router = express()

const{
    tokenValidation,
    authorization
} = require('../controller/authorizationControlller')

const {
    postProduct,
    updateProduct,
    deleteProduct,
    likesProduct
} = require('../controller/productController')

router.post('/add/product/:userId', tokenValidation, authorization("admin", "teacher"), postProduct)
router.delete('/delete/product/:userId/:productId', tokenValidation, authorization("admin", "teacher"), deleteProduct)
router.patch('/update/product/:userId/:productId', tokenValidation, authorization("admin", "teacher"), updateProduct)
router.patch('/like/product/:userId/:productId', tokenValidation, authorization("admin", "teacher"), likesProduct)

module.exports = router