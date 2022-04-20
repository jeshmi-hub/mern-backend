const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        tirm: true,
        required: true,
    },
    likes: {
        type: Array,
        default: []
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {timestamps: true})

module.exports = mongoose.model('Recipe', recipeSchema)