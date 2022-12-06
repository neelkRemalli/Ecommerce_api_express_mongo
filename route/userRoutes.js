import express from 'express';
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  upadateUserPassword,
  updateUser,
} from '../controller/userController.js';
import protectedUser from '../middleware/protectedUser.js';
import authorizePermission from '../middleware/authorizePermission.js';
const router = express.Router();

router.route('/').get(protectedUser, authorizePermission('admin'), getAllUsers);
router.route('/showMe').get(protectedUser, showCurrentUser);

router.route('/updateUser').patch(protectedUser, updateUser);
router.route('/updateUserPassword').patch(protectedUser, upadateUserPassword);

router.route('/:id').get(protectedUser, getSingleUser);

export default router;
