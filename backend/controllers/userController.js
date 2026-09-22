const { generateToken } = require("../middleware/auth");
const User = require("../models/user");
 
const addUser=async(req,res)=>{
    try{
        const exist = await User.findOne({email:req.body.email})
        if(exist){
            return res.status(409).json({error:"User already exist with this mail Id"})
        }
        else{
            const newUser=await User.create(req.body)
            return res.status(200).json({message:'Success'})

        }
    }
    catch(err){
        console.log(err.stack);
        return res.status(500).json({message:err.message})
    }
}
 
 
const getUserByEmailAndPassword=async(req,res)=>{
    try{
        const {email,password}=req.body;
        // console.log(req.body);
        const userExists=await User.findOne({email})
        if(!userExists){
            return res.status(404).json({message:'User not found'})
        }
        const checkPassword=await User.findOne({email,password})
        if(!checkPassword){
            return res.status(401).json({message:'Invalid Password'})
        }
        const {username,userRole,id:_id}=userExists
        const token=generateToken({username,userRole,id:_id});
        return res.status(200).json({id:_id,username:userExists.username,role:userExists.userRole,token});
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

const getAllUsers=async(req,res)=>{
    try{
        const users=await User.find();
        return res.status(200).json(users)
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

module.exports={getUserByEmailAndPassword,addUser,getAllUsers}