const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        maxlength:25,
        minlength:4,
        required: true
    },
    email:{
        type: String,
        maxlength: 50,
        minlength: 10,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['admin', 'teacher', 'student'],
        lowercase: true,
    },
    passwordChangedAt:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', userSchema)