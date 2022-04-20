const Product = require('../model/Product')
const User = require('../model/User')
const util = require('util')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const req = require('express/lib/request')
const { decode } = require('punycode')
const { ignore } = require('nodemon/lib/rules')
const { update } = require('../model/User')

const decodeToken = async (token, req) => {
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1]
    }
    const decode = await util.promisify(jwt.verify)(token, process.env.SECRET)
    const decoded = decode.id
    return decoded
}

const response = (product, statuscode, message, res) => {
    res.status(statuscode).json({message: message, data: {product}})
}

const postProduct = async (req, res ,next) => {
    const productObject = req.body
    let token
    const loginUser = await decodeToken(token, req)
    const user = await User.findById(loginUser)
    if(!user){
        return res.json("no such user found")
    }
    try{
        if(user.role === "admin" || req.params.userId === loginUser){
        productObject.userId = loginUser
        const product = await new Product(productObject).save()
        response(product, 200, "product created", res)}else{
            return res.json("invalid user")
        }
    }catch(err){
        res.json(err.message)
    }
}

const updateProduct = async(req,res,next) => {
    const updateProductObject = req.body
    const{name, description, loginuserId, password} = updateProductObject
    let token
    const loginUser = await decodeToken(token, req)
    const user = await User.findById(loginUser)
    if(!user){
        return res.json("no such user")
    }
    const product = await Product.findById(req.params.productId)
    if(!product){
      
        return res.json(" no such product")
     
    }try{
    if(req.params.userId === loginUser){
        if(user.role === "admin" || product.userId.equals(loginUser)){
            if(!updateProductObject.password){
                console.log("password required")
                return res.json("password required")
            }
            if(updateProductObject.password && bcrypt.compareSync(updateProductObject.password, user.password)){
                const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, {$set: updateProductObject})
                response(updatedProduct, 200, "product Updated", res)
            }else{
                return res.json("password invalid")
            }
        }}else{
            res.json("cannot perform this task")
        }

    }catch(err){
        res.json(err.message)
    }
}

const deleteProduct = async (req, res, next) => {
    const deleteProductObject = req.body
    const{password} = deleteProductObject
    let token
    const loginUser = await decodeToken(token, req)
    const user = await User.findById(loginUser)
    if(!user){
        return res.json("no such user")
    }
    const product = await Product.findById(req.params.productId)
    if(!product){
        return res.json(" no such product")
    }try{
        if(req.params.userId === loginUser){
        if(user.role === "admin", product.userId.equals(loginUser)){
            if(!deleteProductObject.password){
                return res.json("password required")
            }
            if(deleteProductObject.password && bcrypt.compareSync(deleteProductObject.password, user.password)){
                const updatedProduct = await Product.findByIdAndRemove(req.params.productId, {$set: deleteProductObject})
                response(updatedProduct, 200, "product delted", res)
            }else{
                return res.json("password invalid")
            }
        }
    }else{
        return res.json("cannot perform this task")
    }
    }catch(err){
        res.json(err.message)
    }
}

const likesProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.json("no such product")
        }
        const currentUser = await User.findById(req.params.userId)
        if (!currentUser) {
            return res.json("user doesnt exist")
        }
        if (!product.likes.includes(req.params.userId)) {
           const updatedProduct = await product.updateOne({ $push: { likes: req.params.userId } })
            response(updatedProduct, 200, "liked", res)
        } else {
           const updatedProduct = await product.updateOne({ $pull: { likes: req.params.userId } })
            response(updatedProduct, 200, "disliked", res)
        }
    } catch (err) {
        res.json(err.message)
    }
}




module.exports = {
    postProduct,
    updateProduct,
    deleteProduct,
    likesProduct
}