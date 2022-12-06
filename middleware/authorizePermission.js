import CustomApiError from '../config/customApi.js';

const authorizePermission = (...roles) => {
  return (req, res, next)=> {
  if(!roles.includes(req.user.role)){
    throw new CustomApiError(`Unauhorized to access this route`,403);
  }
  next()
  }

  next();
};

export default authorizePermission;
