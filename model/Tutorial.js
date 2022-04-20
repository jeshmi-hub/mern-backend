const mongoose = require('mongoose')

const tutorialSchema = new mongoose.Schema({
    video: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        required: true,
        trim: true,

    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Tutorial", tutorialSchema)