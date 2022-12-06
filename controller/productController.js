import CustomApiError from '../config/customApi.js';
import Product from '../models/productSchema.js';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/////////// Create Product //////////
export const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const products = await Product.create(req.body);
  res.status(201).json(products);
};
/////////// getAllProduct Product //////////
export const getAllProduct = async (req, res) => {
  const products = await Product.find().populate('reviews');
  res.status(200).json(products);
};
/////////// getSingleProduct  //////////
export const getSingleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews');

  if (!product) {
    throw new CustomApiError(`Product not found`, 404);
  }
  res.status(200).json(product);
};
/////////// updateProduct  //////////
export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new CustomApiError(`Product not found`, 404);
  }
  const newProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json(newProduct);
};
/////////// deleteProduct //////////
export const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
  if (!product) {
    throw new CustomApiError(`Product not found`, 404);
  }
  product.remove()
  res.status(204).json({msg:'Product deleted successfully'});
};
/////////// uplaod image //////////
export const uploadImage = async (req, res) => {
  if(!req.files){
    throw new CustomApiError(`No file upload`, 400)
  }
  const productImage = req.files.image;
  if(!productImage.mimetype.startsWith('image')){
    throw new CustomApiError(`Please file must be an image`, 400)
  }
  
  const maxSize = 1024 * 1024;
  if(productImage.size >  maxSize){
    throw new CustomApiError(`file upload must be less than 1MB`, 400)
  }
  const pathImage = path.join(__dirname,`../public/uploads/${productImage.name}`)
  await productImage.mv(pathImage)

  
  res.status(200).json({image:`/uploads/${productImage.name}`});
};
