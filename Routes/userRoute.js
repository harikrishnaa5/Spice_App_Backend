import express from "express"
import { deleteUser,getAlluser, followUser, getUser, UnfollowUser, updateUser, SearchUsers } from "../Controller/userController.js";
import authMiddlware from "../Middlewares/authMiddlware.js";

const router = express.Router();

router.get('/:id', getUser)
router.get('/',authMiddlware, getAlluser)
router.put('/:id',authMiddlware, updateUser)
router.delete('/:id',authMiddlware, deleteUser)
router.put('/:id/follow',authMiddlware, followUser)
router.put('/:id/unfollow',authMiddlware, UnfollowUser)
router.post('/SearchUsers',SearchUsers)
export default router;