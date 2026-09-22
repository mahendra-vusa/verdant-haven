const jwt= require('jsonwebtoken');
 
require('dotenv').config();
 
const generateToken=(user)=>{
    return jwt.sign(user,process.env.JWT_SECREAT_KEY)
 
}
 
const authentication = (req,res,next) => {
    try {
        const authHeader = req.headers['authorization']
        if(!authHeader || !authHeader.startsWith('Bearer') ){
           return res.status(401).json({message:"Token missing or malformed"})
        }
        const token = authHeader.substring(7)
        jwt.verify(token,process.env.JWT_SECREAT_KEY);
        // console.log(process.env.JWT_SECREAT_KEY);
        next()
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Something went wrong"})
    }
}


module.exports={authentication,generateToken}
