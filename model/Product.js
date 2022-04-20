const mongoose = require('mongoose')

 const productSchema = new mongoose.Schema({
     name:{
         type: String,
         required: true,
         trim: true
     },
     image:{
         type: String,
         default: ''
     },
     description:{
         type: String,
         maxlength: 255,
         required: true,
         trim: true
     },
     likes:{
         type: Array,
         default: []
     },
     userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
     }
 }, {timestamps: true})

 module.exports = mongoose.model("Product", productSchema)