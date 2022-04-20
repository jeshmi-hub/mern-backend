const User = require('../model/User')
const Recipe = require('../model/Recipe')
const util = require('util')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const decodeToken = async (token, req) => {
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1]
    }
    const decode = await util.promisify(jwt.verify)(token, process.env.SECRET)
    const decoded = decode.id
    return decoded
}

const response = (recipe, statuscode, message, res) => {
    res.status(statuscode).json({message: message, data: {recipe}})
}

const postRecipe = async (req, res, next) => {
    const recipeObject = req.body
    let token
    const loginUser = await decodeToken(token, req)
    const user = await User.findById(loginUser)
    if(!user){
        return res.json("no such user found")
    }
    try{
        if(user.role === "admin" || req.params.userId === loginUser){
        recipeObject.userId = loginUser
        const recipe = await new Recipe(recipeObject).save()
        response(recipe, 200, "recipe created", res)}else{
            return res.json("invalid user")
        }
    }catch(err){
        res.json(err.message)
    }
}

const updateRecipe = async(req, res, next) => {
    const updateRecipeObject = req.body
    const{name, description, loginuserId, password} = updateRecipeObject
    let token
    const loginUser = await decodeToken(token, req)
    const user = await User.findById(loginUser)
    if(!user){
        return res.json("no such user")
    }
    const recipe = await Recipe.findById(req.params.recipeId    )
    if(!recipe){
      
        return res.json(" no such recipe")
     
    }try{
    if(req.params.userId === loginUser){
        if(user.role === "admin" || recipe.userId.equals(loginUser)){
            if(!updateRecipeObject.password){
                console.log("password required")
                return res.json("password required")
            }
            if(updateRecipeObject.password && bcrypt.compareSync(updateRecipeObject.password, user.password)){
                const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.recipeId   , {$set: updateRecipeObject})
                response(updatedRecipe, 200, "recipe Updated", res)
            }else{
                return res.json("password invalid")
            }
        }}else{
            return res.json("cannot perform this task")
        }

    }catch(err){
        res.json(err.message)
    }
}

const deleteRecipe = async(req, res, next) => {
    const recipeObject = req.body
    const{password} = recipeObject
    let token
    const loginUser = await decodeToken(token, req)
    const user = await User.findById(loginUser)
    if(!user){
        return res.json("no such user")
    }
    const recipe = await Recipe.findById(req.params.recipeId  )
    if(!recipe){
        return res.json(" no such recipe")
    }try{
        if(req.params.userId === loginUser){
        if(user.role === "admin", recipe.userId.equals(loginUser)){
            if(!recipeObject.password){
                return res.json("password required")
            }
            if(recipeObject.password && bcrypt.compareSync(recipeObject.password, user.password)){
                const updatedRecipe = await Recipe.findByIdAndRemove(req.params.recipeId  , {$set: recipeObject})
                response(updatedRecipe, 200, "recipe delted", res)
            }else{
                return res.json("password invalid")
            }
        }}else{
            return res.json("you canno perform this task")
        }

    }catch(err){
        res.json(err.message)
    }
}

const likesProduct = async(req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId);
        if (!recipe) {
            return res.json("no such recipe")
        }
        const currentUser = await User.findById(req.params.userId)
        if (!currentUser) {
            return res.json("user doesnt exist")
        }
        if (!recipe.likes.includes(req.params.userId)) {
           const updatedRecipe = await recipe.updateOne({ $push: { likes: req.params.userId } })
            response(updatedRecipe, 200, "liked", res)
        } else {
           const updatedRecipe = await recipe.updateOne({ $pull: { likes: req.params.userId } })
            response(updatedRecipe, 200, "disliked", res)
        }
    } catch (err) {
        res.json(err.message)
    }
}

module.exports = {
    postRecipe,
    updateRecipe,
    deleteRecipe,
    likesProduct
}