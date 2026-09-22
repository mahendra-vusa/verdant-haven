const adminRouter = require('express').Router();
const { getAllDetails,healthCheck } = require('../controllers/adminController');

adminRouter.get('/getAllDetails', getAllDetails);
adminRouter.get('/healthCheck', healthCheck);

module.exports = adminRouter;