const mongoose=require('mongoose')

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        match:/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        // validate:{
        //     validator:(v)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        //     message:(props)=>'Invalid Email'
        // }
    },
    mobileNumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    userRole:{
        type:String,
        required:true
    }
});

module.exports=mongoose.model('User',userSchema);