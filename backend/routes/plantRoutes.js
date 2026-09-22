const {getAllPlants,getPlantById,addPlant,updatePlant,deletePlant}=require('../controllers/plantController');
 
const plantRouter=require('express').Router();
const {authentication} = require('../middleware/auth')
const roleAuthentication = require('../middleware/roleAuth')

plantRouter.get('/getAllPlants',authentication,getAllPlants);
 
plantRouter.get('/getPlantById/:id',authentication,getPlantById);
 
plantRouter.post('/addPlant',authentication,addPlant);
 
plantRouter.put('/updatePlant/:id',authentication,updatePlant);
 
plantRouter.delete('/deletePlant/:id',authentication,deletePlant);
 
module.exports=plantRouter
