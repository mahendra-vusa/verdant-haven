const reviewController = require('../controllers/reviewController')

const reviewRouter = require('express').Router()
const {authentication} = require('../middleware/auth')
reviewRouter.get('/',authentication,reviewController.getAllReviews)
reviewRouter.get('/getById/:id',authentication,reviewController.getReviewById)
reviewRouter.get('/getByUserId/:id',authentication,reviewController.getReviewsByUserId)
reviewRouter.get('/getByPlantId/:id',authentication,reviewController.getReviewsByPlantId)
reviewRouter.post('/add',authentication,reviewController.addReview)
reviewRouter.put('/updateReview/:id',authentication,reviewController.updateReview)
reviewRouter.delete('/deleteReview/:id',authentication,reviewController.deleteReview)

module.exports = reviewRouter
