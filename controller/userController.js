const { use } = require('bcrypt/promises')
const User = require('../model/User')
const util = require('util')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { update, findById, findByIdAndUpdate } = require('../model/User')

const decodeToken = async(token, req) => {
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1]
    }
    const decode = await util.promisify(jwt.verify)(token, process.env.SECRET)
    const decoded = decode.id
    return decoded
}

const response = (user, statuscode, res) => {
    res.status(statuscode).json({data: user})
}

const getAllUser = async (req, res, next) => {
try{
    const user = await User.find()
    console.log(user)
    if(user){
    response(user, 200, res)}
    else{
        res.json("no users")
    }
}catch(err){
    res.json(err.message)
}
}

const getUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.userId)
        if(!user){
            return res.json("user doesnt exist")
        }
        response(user, 200, res)
    } catch(err){
        res.json(err.message)
    }

}

const updateUser = async(req, res, next) => {
    console.log("hello")
    const updateObject = req.body
    const {username, email, password} = updateObject
    let token
   const loginUser = await decodeToken(token, req)
   console.log(loginUser)
    const user = await User.findById(loginUser)
    if(!user){
        return res.json("no such user")
    }
    if(user.role === "admin" || loginUser === req.params.userId){
        if(!updateObject.password){
            return res.json("password required")
        }
        console.log(user.password)
        if(updateObject.password && bcrypt.compareSync(updateObject.password, user.password)){
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: updateObject})
            if(!updatedUser){
                return res.json("no such user")
            }
            response(updatedUser, 200, res)
        }else{
            return res.json("password didnt matched")
        }
    }

}

const deleteUser = async(req, res ,next) => {
    const updateObject = {
        password: req.body.password
    }
    let token
   const loginUser = await decodeToken(token, req)
   console.log(loginUser)
    const user = await User.findById(loginUser)
    if(!user){
        return res.json("no such user")
    }
    try{
    if(user.role === "admin" || loginUser === req.params.userId){
        if(!updateObject.password){
            return res.json("password required")
        }
       if(updateObject.password && bcrypt.compareSync(updateObject.password, user.confirmPassword)){
           res.json("hello")
       }
    }}catch(err){
        res.json(err.message)
    }

}



module.exports = {
    getAllUser,
    getUser,
    updateUser,
    deleteUser
}