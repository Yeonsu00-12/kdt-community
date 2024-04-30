import express from "express";
import * as p from '../controller/postCtrl.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({dest: 'uploads/'})

router.get('/', p.getPosts);
router.post('/',upload.single('image'), p.createPost);

router.get('/:postId', p.getPostDetail);
router.delete('/:postId', p.deletePost);

export default router;