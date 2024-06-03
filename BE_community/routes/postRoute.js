import express from "express";
import * as p from '../controller/postCtrl.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/image');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', p.getPosts);
router.post('/', upload.single('image'), p.createPost);

router.get('/:postId', p.getPostDetails);
router.put('/:postId', upload.single('image'), p.updatePost);
router.delete('/:postId', p.deletePost);

router.post('/comment', p.addComment);
router.put('/comment', p.updateComment);
router.delete('/comment/:commentId', p.deleteComment);

export default router;