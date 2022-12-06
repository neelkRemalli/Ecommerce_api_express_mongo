import Review from '../models/reviewSchema.js';
import CustomApiError from '../config/customApi.js';
import Product from '../models/productSchema.js';

////////// Create Review ///////
export const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomApiError(`Product not found`, 404);
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (alreadySubmitted) {
    throw new CustomApiError(`Already submitted review for this Product`, 400);
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);

  res.status(200).json(review);
};

////////// Get All  Review ///////
export const getAllReview = async (req, res) => {
  const reviews = await Review.find().populate({
    path: 'product',
    select: 'name company price',
  });
  res.status(200).json(reviews);
};
////////// Get All  Review ///////
export const getSingleReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new CustomApiError(`Review not found`, 404);
  }
  res.status(200).json(review);
};
////////// Update  Review ///////
export const updateReview = async (req, res) => {
  const {rating, title, comment} = req.body;
  
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new CustomApiError(`Review not found`, 404);
  }
  
  if (req.user.role === 'admin' || review.user.toString() === req.user.userId) {
    review.rating = rating  || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
   
  } else {
    throw new CustomApiError(`Not authorized to deleted this review`, 403);
  }
  await review.save()
  res.status(200).json(review);
};
////////// Delete  Review ///////
export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    throw new CustomApiError(`Review not found`, 404);
  }

  if (req.user.role === 'admin' || review.user.toString() === req.user.userId) {
    await review.remove();
  } else {
    throw new CustomApiError(`Not authorized to deleted this review`, 403);
  }

  res.status(200).json('review delete successfully');
};

////////// get signle product  Review ///////

export const getSingleProductReview = async( req, res) =>{
  const {id:productId} = req.params;
  const reviews = await Review.find({product:productId})
  res.status(200).json(reviews)
}
