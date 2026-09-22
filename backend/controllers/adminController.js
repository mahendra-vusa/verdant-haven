const User = require('../models/user');
const Plant = require('../models/plant');
const Order = require('../models/order');
const Review = require('../models/review');


const mongoose = require("mongoose");


const healthCheck = async (req, res) => {
  try {
    // Check MongoDB connection
    const dbStatus =
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected";

    // Test database by counting users
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      status: "OK",
      message: "GreenGarden Backend is healthy",
      server: "Running",
      database: dbStatus,
      totalUsers,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      status: "FAILED",
      message: "Health check failed",
      error: error.message,
    });
  }
};

const getAllDetails=async (req, res) => {
  try {
    // Implementation for getting all details
    const users = await User.find();
    const plants = await Plant.find().countDocuments();
    const orders = await Order.find().countDocuments();
    const reviews = await Review.find().countDocuments();
    // const usersList = await User.find({}, 'username email mobileNumber');

    res.status(200).json({
      users,
      plants,
      orders,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports={getAllDetails,healthCheck};