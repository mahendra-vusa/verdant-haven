const mongoose=require('mongoose')

const platntSchema=mongoose.Schema({
    plantName:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:[0,'Minimum value should be 0.']
    },
    stockQuantity:{
        type:Number,
        required:true,
        min:[0,'Minimum value should be 0.']
    },
    category:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Plants',platntSchema)