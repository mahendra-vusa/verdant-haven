require('dotenv').config();
const mongoose=require('mongoose')
const express=require('express')
const cors=require('cors');

// const userRouteFs =require('./routes/userRoutes_fs')
// const plantRouterFs =require('./routes/plantRoutes_fs');
const plantRouter = require('./routes/plantRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const adminRouter = require('./routes/adminRoutes');

const app=express();
const port=process.env.APP_PORT;

//MiddleWares
app.use(express.json({limit:'10mb'}))

app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Authorization','Content-Type'],
    credentials:true,
}))



//FileSystem ROuters
// app.use('/user_fs',userRouteFs)
// app.use('/plant_fs',plantRouterFs)


//DB Routers

app.use('/plants',plantRouter)
app.use('/users',userRouter)
app.use('/orders',orderRouter)
app.use('/reviews',reviewRouter);
app.use('/admin',adminRouter);

// console.log(process.env.JWT_SECREAT_KEY);

mongoose.connect(process.env.DATABASE_URL,{
    
}).then(()=>{
    console.log('Nursery Database connected successfully')
    app.listen(port,()=>{
        
        console.log(`App listening at ${port} port`);
        console.log(`http://localhost:${port}`);
    })
}).catch((err)=>{
    console.error(err.message)
})
