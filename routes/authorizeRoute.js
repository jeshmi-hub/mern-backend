const express = require('express')

const router = express()

const {
    register,
    registerStudent,
    registerTeacher,
    login,
    tokenValidation
} = require('../controller/authorizationControlller')

router.post('/register/student', registerStudent)
router.post('/register/teacher', registerTeacher)
router.post('/register', register)
router.post('/login', login)
router.get('/tokenValidation', tokenValidation)


module.exports = router

