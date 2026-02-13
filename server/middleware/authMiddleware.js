export const verifyAdmin = async(req,res,next)=>{
    const key = req.headers['x-admin-key'];
    const serverkey = process.env.ADMIN_API_KEY;

    if(!key || serverkey!= key){
        return res.status(403).json({
            statusCode: 403,
            message : "Forbidden action",
        })
    }

    next();
}