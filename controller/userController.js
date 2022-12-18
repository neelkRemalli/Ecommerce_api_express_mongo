import User from '../models/usershcema.js';
import CustomApiError from '../config/customApi.js';

///////// Get all User /////////
export const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' });

  res.status(200).json(users);
};

///////// Get Single User /////////
export const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new CustomApiError(`User not found`, 404);
  }
 
  if(req.user.role == 'admin' ||user._id.toString() === req.user.userId )  {
    res.status(200).json(user)
  }else{
    throw new CustomApiError(`Unauthorized to access this route`)
  }

};

///////// Get Current User /////////
export const showCurrentUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};

///////// Update User /////////
export const updateUser = async (req, res) => {
  const { name, email } = req.body;
 
  const user = await User.findOne({_id:req.user.userId})

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save()
       const token = user.createJWT()
    const oneDay = 60 * 60 * 100 * 24
    res.cookie('token', token,{
        httpOnly: true,
        expires:new Date(Date.now() + oneDay),
        asinged: true,
        secure: process.env.NODE_ENV === 'production' 
    })
  
    res.status(200).json(user);
 }


///////// UPdate Password User /////////
export const upadateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomApiError(`Please provide both passwords`, 400);
  }

  const user = await User.findOne({ _id: req.user.userId }).select('+password');

  const isMatch = await user.comparePassword(oldPassword);

  if (!isMatch) {
    throw new CustomApiError(`Invalid Credentials`, 400);
  }

  user.password = newPassword;
  user.save();
  res.status(200).json({msg:'password updated successfully'});
};
