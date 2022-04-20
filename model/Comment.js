const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    
    comment:{
        type: String,
        required: true,
        trim: true
    }
})