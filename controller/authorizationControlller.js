const User = require('../model/User')
const validator = require('validator')
const bcrypt = require('bcrypt')
const util = require('util')
const jwt = require('jsonwebtoken')

const SALT = parseInt(process.env.SALT)

const signToken = id => {
    const token = jwt.sign({id}, process.env.SECRET, {expiresIn:"1h"})
    return token
}

const tokenRespone = (user, statuscode, res) => {
    const token = signToken(user._id)
    res.status(statuscode).json({
        status: "success", token, data: {
            user
        }
    })
}

const register = async (req, res, next) => {
    const registerObject = req.body
    const existingUser = await User.findOne({email: registerObject.email})
    if(!existingUser){
        const existingUsername = await User.findOne({username: registerObject.username})
        if(!existingUsername){
        try{
            if(registerObject.password === registerObject.confirmPassword){
                registerObject.password = bcrypt.hashSync(registerObject.password, SALT)
                registerObject.confirmPassword = bcrypt.hashSync(registerObject.confirmPassword, SALT)
                registerObject.role === "admin"
                const user = await new User(registerObject).save()
                tokenRespone(user, 200, res)
            }
        }catch(err){
            res.json(err.message)
        }
    }else{
            return res.json("username exist")
        }
    }
    else{
        return res.json("user already exist")
    }
}

const registerStudent = async (req, res, next) => {
    const registerObject = req.body
    const existingUser = await User.findOne({email: registerObject.email})
    if(!existingUser){
        const existingUsername = await User.findOne({username: registerObject.username})
        if(!existingUsername){
        try{
            if(registerObject.password === registerObject.confirmPassword){
                registerObject.password = bcrypt.hashSync(registerObject.password, SALT)
                registerObject.confirmPassword = bcrypt.hashSync(registerObject.confirmPassword, SALT)
                registerObject.role === "student"
                const user = await new User(registerObject).save()
                tokenRespone(user, 200, res)
            }
        }catch(err){
            res.json(err.message)
        }
    }else{
            return res.json("username exist")
        }
    }
    else{
        return res.json("user already exist")
    }
}

const registerTeacher = async (req, res, next) => {
    const registerObject = req.body
    const existingUser = await User.findOne({email: registerObject.email})
    if(!existingUser){
        const existingUsername = await User.findOne({username: registerObject.username})
        if(!existingUsername){
        try{
            if(registerObject.password === registerObject.confirmPassword){
                registerObject.password = bcrypt.hashSync(registerObject.password, SALT)
                registerObject.confirmPassword = bcrypt.hashSync(registerObject.confirmPassword, SALT)
                registerObject.role === "teacher"
                const user = await new User(registerObject).save()
                tokenRespone(user, 200, res)
            }
        }catch(err){
            res.json(err.message)
        }
    }else{
            return res.json("username exist")
        }
    }
    else{
        return res.json("user already exist")
    }
}

const login = async (req, res, next) => {
const loginObject = {
    loginType: req.body.loginType,
    password: req.body.password
}
if(!loginObject.loginType || !loginObject.password){
    return res.json("enter all the field")
}
try{
if(validator.isEmail(loginObject.loginType) === true){
    const user = await User.findOne({email: loginObject.loginType})
    if(!user){
        return res.json("no such user")
    }
    if(loginObject.password && bcrypt.compareSync(loginObject.password, user.password)){
        tokenRespone(user, 200, res)
    }else{
        return res.json("credentials didint matched")
    }}else{
        res.json("invalid password or email")
    }
}catch(err){
    res.json(err.message)
}
}

const tokenValidation = async (req, res, next) => {
let token
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(' ')[1]
}
if(!token){
    return res.json(" user not logged in")
}
try{
const decode = await util.promisify(jwt.verify)(token, process.env.SECRET)
const user = await User.findById(decode.id)
if(!user){
    return res.json("no such users")
}
const changeTimeStamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10)
const jwtTimeStamp = decode.iat 
if(changeTimeStamp > jwtTimeStamp){
    console.log("Password has been changed please login")
    return res.json("Password has been changed please login")
    
}
req.user = user
next()
}catch(err){
    res.json(err.message)
}

}

const authorization = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.json("You cannot perform this task")
        }
        next()
    }
}


module.exports = {
    register,
    registerStudent,
    registerTeacher,
    login,
    tokenValidation,
    authorization
}