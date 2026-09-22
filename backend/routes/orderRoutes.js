const orderRouter = require('express').Router()
const orderController = require('../controllers/orderController')
const {authentication} = require('../middleware/auth')
const roleAuthentication = require('../middleware/roleAuth')

orderRouter.post('/add',authentication,orderController.addOrder)
orderRouter.delete('/delete/:id',authentication,orderController.deleteOrder)
orderRouter.get('/',authentication,orderController.getAllOrders)
orderRouter.get('/getByUserId/:id',authentication,orderController.getOrdersByUserId)
orderRouter.get('/getById/:id',authentication,orderController.getOrdersById)
orderRouter.put('/update/:id',authentication,orderController.updateOrder)

module.exports = orderRouter
