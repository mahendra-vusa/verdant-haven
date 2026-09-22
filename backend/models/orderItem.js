const mongoose = require('mongoose')
 
const orderItemSchema = mongoose.Schema({
    quantity:{
        type:Number,
        required:true,
        min:[1,"Minimum value should be 1"]
    },
    price:{
        type:Number,
        required:true,
        min:[0,"Minimum value should be 0"]
    },
    plant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Plant",
        required:true
    },
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    }
})
 
module.exports = mongoose.model("OrderItem",orderItemSchema)