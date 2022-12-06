import express from 'express';
import {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  uploadImage,
} from '../controller/productController.js';
import { getSingleProductReview } from '../controller/reviewController.js';
import authorizePermission from '../middleware/authorizePermission.js';
import protectedUser from '../middleware/protectedUser.js';

const router = express.Router();

router
  .route('/')
  .get(getAllProduct)
  .post(protectedUser, authorizePermission('admin'), createProduct);
router
  .route('/:id')
  .get(getSingleProduct)
  .patch(protectedUser, authorizePermission('admin'), updateProduct)
  .delete(protectedUser, authorizePermission('admin'), deleteProduct);
router
  .route('/uploadImage')
  .post(protectedUser, authorizePermission('admin'), uploadImage);

  router.route('/:id/review').get(getSingleProductReview)

export default router;
