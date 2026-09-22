const {getUserByEmailAndPassword,addUser, getAllUsers}=require('../controllers/userController')

const userRouter=require('express').Router()

userRouter.post('/login',getUserByEmailAndPassword);
userRouter.post('/signup',addUser)
userRouter.get('/',getAllUsers);

module.exports=userRouter
