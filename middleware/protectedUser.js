import jwt from 'jsonwebtoken'
import CustomApiError from '../config/customApi.js'

const protectedUser = async( req, res, next) =>{
    const token = req.signedCookies.token;
    if(!token){
       throw new CustomApiError(`Invalid Authentication`,401)
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const {userId, name, role} = decoded;
        req.user = {userId,name,role}
       
        next()
    } catch (error) {
        throw new CustomApiError(`Invalid Authentication!`,401)
    }
}


export default protectedUser;