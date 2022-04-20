const express = require ('express')
const router = express()

const{
    tokenValidation,
    authorization
} = require('../controller/authorizationControlller')

const {
    getAllUser,
    getUser,
    updateUser,
    deleteUser
} = require('../controller/userController')

router.get('/getAllUser', tokenValidation, authorization('admin'), getAllUser)
router.get('/getUser/:userId', tokenValidation, authorization('admin', 'user'), getUser)
router.patch('/update/user/:userId', tokenValidation, authorization('admin', 'user'), updateUser)
router.delete('/delete/user/:userId', tokenValidation, authorization('admin', 'user'), deleteUser)

module.exports = router