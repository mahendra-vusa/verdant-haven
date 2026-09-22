const roleAuthentication = (req,res,next) =>{
    if(req.body.userRole === 'Admin'){
        next()
    }
    else{
        res.status(403).json({message:"Sorry Unauthorized"})
    }
}

module.exports = roleAuthentication
