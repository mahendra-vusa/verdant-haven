const Plant = require("../models/plant");

const getAllPlants=async(req,res)=>{
    try{
        const plants=await Plant.find();
        return res.status(200).json(plants)
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

const getPlantById=async(req,res)=>{
    try{
        const plant=await Plant.findById(req.params.id)
        if(plant){
            return res.status(200).json(plant)
        }
        return res.status(404).json({success:false,message:'Not found'})

    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

const addPlant=async(req,res)=>{
    try{
        // const {plantName,description,price,stockQuantity,category,coverImage}=req.body;
        // if(!plantName||!description||!price||!stockQuantity||!category||!coverImage){
        //     return res.status(400).json({success:false,message:'All fields are required'})
        // }
        const newPlant= await Plant.create(req.body)
        return res.status(201).json(newPlant) 
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

const updatePlant=async(req,res)=>{
    try{
        // const {plantName,description,price,stockQuantity,category,coverImage}=req.body;
        // if(!plantName||!description||!price||!stockQuantity||!category||!coverImage){
        //     return res.status(400).json({success:false,message:'All fields are required'})
        // }
        const {id}=req.params
        const updatedPlant= await Plant.findByIdAndUpdate(id,req.body,{new:true,runValidators:true})
        if(!updatedPlant){
            return res.status(404).json({message:'Not found'})
        }
        return  res.status(200).json({message:'Plant Updated Successfully',plant:updatedPlant})

    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

const deletePlant=async(req,res)=>{
    try{
        const {id}=req.params
        const deletedPlant= await Plant.findByIdAndDelete(id)
        if(!deletedPlant){
            return res.status(404).json({message:'Not found'})
        }
        return  res.status(200).json({message:'Plant Deleted Successfully'})
    }
    catch(err){
        return res.status(500).json({message:err.message})
    }
}

module.exports={getAllPlants,getPlantById,addPlant,updatePlant,deletePlant}