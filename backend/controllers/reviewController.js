const Review = require('../models/review')

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
        .populate('user', 'username email mobileNumber')
        .populate('plant', 'plantName description price stockQuantity category coverImage')
        return res.status(200).json({ reviews: reviews })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
        .populate('user', 'username email mobileNumber')
        .populate('plant', 'plantName description price stockQuantity category coverImage')
        if (!review) {
            return res.status(404).json({ message: `Review with ID ${req.params.id} not found` })

        }
        res.status(200).json({ review: review })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const getReviewsByUserId = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.params.id })
            .populate('user', 'username email mobileNumber')
            .populate('plant', 'plantName description price stockQuantity category coverImage')
        if (reviews.length == 0) {
            return res.status(404).json({ message: `Reviews for user with ID ${req.params.id} not found` })
        }
        res.status(200).json(reviews)


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getReviewsByPlantId = async (req, res) => {
    try {
        const reviews = await Review.find({ plant: req.params.id })
            .populate('user', 'username email mobileNumber')
            .populate('plant', 'plantName description price stockQuantity category coverImage')
        if (reviews.length == 0) {
            return res.status(404).json({ message: `Reviews for Plant with ID ${req.params.id} not found` })
        }
        res.status(200).json(reviews)


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const addReview = async (req, res) => {
    try {
        const review = await Review.create(req.body)
        return res.status(201).json({ message: "Review Added Successfully", review: review })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const updateReview = async (req,res) => {
    try {
        const updated = await Review.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if(updateReview){
            return res.status(200).json({message:"Review updated successfully",updatedReview:updated})
        }
        else{
            return res.status(404).json({message:`Review with ID ${req.params.id} not found`})
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const deleteReview = async (req,res) => {
 try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if(review){
        return res.status(200).json({message:"Review Deleted Successfully"})
    }
    else{
        return res.status(404).json({message:`Review with ID ${req.params.id} not found`})
    }
 } catch (error) {
    res.status(500).json({ message: error.message })
 }
}

module.exports = {addReview,getAllReviews,getReviewById,getReviewsByPlantId,deleteReview,getReviewsByUserId,updateReview}