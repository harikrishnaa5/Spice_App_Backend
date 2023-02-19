import express from 'express';
import { activateUser, blockUser, getAllPosts } from '../Controller/adminController.js';
import { deleteReported } from '../Controller/postController.js';
import { getAlluser } from '../Controller/userController.js';

const router=express.Router()

router.get('/posts',getAllPosts)
router.put('/block/:id',blockUser);
router.put('/activate/:id',activateUser)
router.get('/user', getAlluser)
router.delete('/remove/:id',deleteReported)
export default router;