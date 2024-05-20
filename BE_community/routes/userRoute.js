import express from 'express';
import multer from 'multer';
import path from 'path';
import {emailCheck,signupCtrl, nameCheck, auth, userLogin, userLogout, profileCheck} from '../controller/userCtrl.js';

const storage = multer.diskStorage({
    destination : function(req,file,cb) {
        cb(null, 'uploads/profile')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const router = express.Router();
const upload = multer({storage : storage});

router.get('/', auth);

router.get('/emailCheck', emailCheck);
router.get('/nicknameCheck', nameCheck);
router.get('/profile', profileCheck);
router.get('/logout', userLogout);

// filename으로 명시된 이름의 파일을 전달받음
router.post('/signup', upload.single('profile'), signupCtrl, (error, req,res, next) => {
    if(error instanceof multer.MulterError){
        res.status(500).json({error : error.message});
    } else if(error){
        res.status(500).json({error : "An unknown error occurred during file upload."})
    }
});
router.post('/login', userLogin);


export default router;