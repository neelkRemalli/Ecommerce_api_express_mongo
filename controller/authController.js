import User from '../models/usershcema.js';
import CustomApiError from '../config/customApi.js';

////////// Register ////////////
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new CustomApiError(`this email ${email} already exists `, 400);
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    signed: true,
  });
  res
    .status(201)
    .json({ name: user.name, userId: user._id, role: user.role, token });
};

////////// Login ////////////
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomApiError(`Please provide all fields`, 400);
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new CustomApiError(`Invalid Credentials`, 400);
  }
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new CustomApiError(`Invalid Credentials`, 400);
  }
  const token = user.createJWT();

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    signed: true,
  });
  res
    .status(200)
    .json({ name: user.name, userId: user._id, role: user.role, token });
};
export const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json('logout');
};
