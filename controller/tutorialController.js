const User = require('../model/User')
const Tutorial = require('../model/Tutorial')
const Recipe = require('../model/Recipe')
const util = require('util')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Product = require('../model/Product')

const decodeToken = async (token, req) => {
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(' ')[1]
    }
    const decode = await util.promisify(jwt.verify)(token, process.env.SECRET)
    const decoded = decode.id
    return decoded
}

const response = (tutorial, statuscode, message, res) => {
    res.status(statuscode).json({message: message, data: {tutorial}})
}

const postTutorial = async (req, res, next) => {
    const tutorialObject = req.body
    let token
    const loginUser = await decodeToken(token, req)
    const user = await User.findById(loginUser)
    if(!user){
        return res.json("no such user found")
    }
    try{
        if(user.role === "admin" || req.params.userId === loginUser){
        tutorialObject.userId = loginUser
        const tutorial = await new Tutorial(tutorialObject).save()
        response(tutorial, 200, "tutorial created", res)}else{
            return res.json("invalid user")
        }
    }catch(err){
        res.json(err.message)
        console.log(err.message)
    }
}

const updateTutorial = async(req, res, next) => {
    const updateTutorialObject = req.body
    const{name, description, loginuserId, password} = updateTutorialObject
    let token
    const loginUser = await decodeToken(token, req)
    const user = await User.findById(loginUser)
    if(!user){
        return res.json("no such user")
    }
    const tutorial = await Tutorial.findById(req.params.tutorialId)
    if(!tutorial){
      
        return res.json(" no such tutorial")
     
    }try{
        if(req.params.userId === loginUser){
        if(user.role === "admin" || tutorial.userId.equals(loginUser)){
            if(!updateTutorialObject.password){
                console.log("password required")
                return res.json("password required")
            }
            if(updateTutorialObject.password && bcrypt.compareSync(updateTutorialObject.password, user.password)){
                const updatedTutorial = await Tutorial.findByIdAndUpdate(req.params.tutorialId, {$set: updateTutorialObject})
                response(updatedTutorial, 200, "tutorial Updated", res)
            }else{
                return res.json("password invalid")
            }
        }}else{
            return res.json("you cannot perfrom this task")
        }

    }catch(err){
        res.json(err.message)
    }
}

const deleteTutorial = async(req, res, next) => {
    const deleteObject = req.body
    const{password} = deleteObject
    let token
    const loginUser = await decodeToken(token, req)
    const user = await User.findById(loginUser)
    if(!user){
       return res.json("no such user")
    }
    const tutorial = await Tutorial.findById(req.params.tutorialId)
    if(!tutorial){
        return res.json("no such tutorial")
    }
    if(user.role === "admin" || loginUser === req.params.userId ){
        try{
            if(user.role === "admin" || tutorial.userId.equals(loginUser)){
                if(!deleteObject.password){
                    return res.json("password required")
                }
                if(deleteObject.password && bcrypt.compareSync(deleteObject.password, user.password)){
                const deletedTutorial = await Tutorial.findByIdAndDelete(req.params.tutorialId)
                if(!deleteTutorial){
                    return res.json("no such tutorial")
                }
                response(deletedTutorial, 200, "deleted", res)
            }else{
                    return res.json("password didint matched")
                }

            }
        }catch(err){
            res.json(err.message)
        }
    }else{
        return res.json("u cannot perfrom this task")
    }
}


module.exports = {
    postTutorial,
    updateTutorial,
    deleteTutorial,
 
}