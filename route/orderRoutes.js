import express from 'express';
import {
  getAllOrders,
  createOrder,
  getCurrentUserOrders,
  updateOrder,
  getSingleOrder,
} from '../controller/orderController.js';
import protectedUser from '../middleware/protectedUser.js';
import authorizePermission from '../middleware/authorizePermission.js';

const router = express.Router();

router
  .route('/')
  .get(protectedUser, authorizePermission('admin'), getAllOrders)
  .post(protectedUser, createOrder);
router.route('/showAllMyOrders').get(protectedUser, getCurrentUserOrders);
router
  .route('/:id')
  .get(protectedUser, getSingleOrder)
  .patch(protectedUser, updateOrder);

export default router;
