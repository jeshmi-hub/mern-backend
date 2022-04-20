const express = require('express')
const router = express()

const{
    tokenValidation,
    authorization
} = require('../controller/authorizationControlller')

const {
    postTutorial,
    updateTutorial,
    deleteTutorial,
} = require('../controller/tutorialController')

router.post('/add/tutorial/:userId', tokenValidation, authorization("admin", "teacher"), postTutorial)
router.delete('/delete/tutorial/:userId/:tutorialId', tokenValidation, authorization("admin", "teacher"), deleteTutorial)
router.patch('/update/tutorial/:userId/:tutorialId', tokenValidation, authorization("admin", "teacher"), updateTutorial)

module.exports = router