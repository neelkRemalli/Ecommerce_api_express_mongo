import express from 'express';
import {
  getAllReview,
  createReview,
  getSingleReview,
  updateReview,
  deleteReview,
} from '../controller/reviewController.js';

import protectedUser from '../middleware/protectedUser.js';

const router = express.Router();

router.route('/').get(getAllReview).
  post(protectedUser,  createReview);
router
  .route('/:id')
  .get( getSingleReview)
  .patch(protectedUser,  updateReview)
  .delete(protectedUser,  deleteReview);

export default router;
