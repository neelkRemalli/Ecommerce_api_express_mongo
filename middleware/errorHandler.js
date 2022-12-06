



import CustomAPI from '../config/customApi.js';
const errorHandlerMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(error);

  // id field entered error
  if (err.name === 'CastError') {
    const message = `Resources not found`
 
    error = new CustomAPI(message, 404);
  }
  
  
  // duplicate field entered error
  if (err.code === 11000) {
    const message = `duplicate field entered for ${Object.keys(err.keyValue)}`
 
    error = new CustomAPI(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ msg: error.message || 'Server Error!!' });
};

export default errorHandlerMiddleware;





