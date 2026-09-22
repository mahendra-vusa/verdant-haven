const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    reviewText:{
        type:String,
        trim:true,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:[1,"Minimum value should be 1"],
        max:[5,"Maximum value should be 5"]
    },
    date:{
        type:Date,
        default:Date.now()
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    
    plant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Plants",
        required:true
    }
})

module.exports = mongoose.model("Review",reviewSchema)