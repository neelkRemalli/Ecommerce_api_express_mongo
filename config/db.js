import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGUURI);
    console.log('DB connected successfully!!');
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
