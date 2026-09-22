const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const Plant = require('../models/plant'); 
const mongoose = require('mongoose');

const addOrder = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const { orderItems, user, shippingAddress, billingAddress } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }

        let newOrder = new Order({
            user: new mongoose.Types.ObjectId(user),
            shippingAddress: shippingAddress,
            billingAddress: billingAddress,
            orderStatus: 'Pending',
            totalAmount: 0, 
            orderItems: []
        });

       
        newOrder = await newOrder.save();

        let totalAmount = 0;
        const orderItemIds = [];

        for (const item of orderItems) {
            const plant = await Plant.findById(item.plant);
            if (!plant) {

                return res.status(404).json({ message: `Plant with id ${item.plant} not found` });
            }

            if (plant.stockQuantity < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${plant.plantName}. Available: ${plant.stockQuantity}` });
            }
            plant.stockQuantity -= item.quantity;
            await plant.save();
            const orderItem = new OrderItem({
                quantity: item.quantity,
                price: plant.price, 
                plant: item.plant,
                order: newOrder._id,
            });


            const savedOrderItem = await orderItem.save();
            orderItemIds.push(savedOrderItem._id);

            totalAmount += (item.quantity * plant.price);
        }
        newOrder.orderItems = orderItemIds;
        newOrder.totalAmount = totalAmount;
        const updatedOrder = await newOrder.save();
        res.status(201).json({
            message: 'Order Placed Successfully',
            order: updatedOrder
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'username email mobileNumber') 
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'plant',
                    model: 'Plants' 
                }
            });
        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrdersById = async(req,res) => {
    try {
        const data = await Order.find({orders:req.params.id}).populate('user', 'username email mobileNumber') 
        .populate({
            path: 'orderItems',
            populate: {
                path: 'plant',
                model: 'Plants' 
            }
        });
        if(data.length == 0 ){
            return res.status(404).json({message:`Order with ID ${req.params.id} not found`})
        }
        else{
            res.status(200).json(data)
        }

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const getOrdersByUserId = async(req,res) => {
    try {
        const data = await Order.find({user:req.params.id}).populate('user', 'username email mobileNumber') 
        .populate({
            path: 'orderItems',
            populate: {
                path: 'plant',
                model: 'Plants' 
            }
        });
        if(data.length == 0 ){
            return res.status(404).json({message:`User with ID ${req.params.id} not found`})
        }
        else{
            res.status(200).json(data)
        }

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


const updateOrder = async (req,res) => {
    try {
        const updatedData = await Order.findByIdAndUpdate(req.params.id , req.body , {new:true})
    if(updatedData){
        return res.status(200).json({message:"Order Updated Successfully",order:updatedData})
    }
    else{
        return res.status(404).json({message:`User with ID ${req.params.id} not found`})
    }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}



const deleteOrder = async(req,res)=>{
    try {
        const data = await Order.findByIdAndDelete(req.params.id)
        if(data){
            return res.status(200).json({message:"Order Deleted Successfully"})
        }
        else{
            res.status(404).json({message:"Order not found"})
        }
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


module.exports = {
    addOrder,getAllOrders,deleteOrder,getOrdersByUserId,updateOrder,getOrdersById
};