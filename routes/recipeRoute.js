const express = require('express')
const router = express()

const{
    tokenValidation,
    authorization
} = require('../controller/authorizationControlller')

const {
    postRecipe,
    updateRecipe,
    deleteRecipe,
    likesProduct
} = require('../controller/recipeController')

router.post('/add/Recepie/:userId', tokenValidation, authorization("admin", "teacher"), postRecipe)
router.delete('/delete/Recepie/:userId/:recipeId', tokenValidation, authorization("admin", "teacher"), deleteRecipe)
router.patch('/update/Recepie/:userId/:recipeId', tokenValidation, authorization("admin", "teacher"), updateRecipe)
router.patch('/like/Recepie/:userId/:recipeId', tokenValidation, authorization("admin", "teacher","student"), likesProduct)

module.exports = router