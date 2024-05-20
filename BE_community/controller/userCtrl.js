import {getEmailCheck ,getnameCheck, getProfile, signup, login} from "../api/user.js";

export const auth = (req, res) => {
    if(req.cookies.userData) {
        const user = JSON.parse(req.cookies.userData);
        console.log("logged in user : ", user);
        res.json({user});
    } else {
        console.log('no user logged in');
        res.status(404).json({message : "not found"});
    }
};

export const signupCtrl = async(req,res) => {
    try{
        const {email, nickname, password} = req.body;
        const profileFilename = req.file ? req.file.filename : null;

        if (!profileFilename) {
            return res.status(400).send({ error: 'Profile picture is required.' });
        }

        const newUser = await signup({email, password, nickname, profileFilename});
        res.status(201).send({message : "새로운 유저가 생성되었습니다.", user: newUser});
    }catch (error) {
        console.log(error);
        res.status(500).send({error : 'server Error during registration', details : error.toString() });
    }
}

export const emailCheck = (req, res) => {
    const userEmail = req.query.email;
    if(!userEmail) {
        return res.status(400).send({message: "유효하지 않은 이메일"});
    }
    try {
        const emailExists = getEmailCheck(userEmail);
        if(emailExists){
            return res.status(200).send({exist : true});
        } else {
            return res.status(200).send({exist: false});
        }
    } catch(error) {
        return res.status(500).send({message: "이메일 중복 체크 에러 : ", error: error.message});
    };
}

export const profileCheck = (req, res) => {
    const userData = req.cookies.userData;

    if (!userData) {
        return res.status(401).json({ error: "No user logged in" });
    }

    const user = JSON.parse(userData);
    const userEmail = user.email;
    
    const userProfile = getProfile(userEmail); // 이메일을 기반으로 프로필 경로를 가져옵니다.

    if (userProfile) {
        // 프로필 경로가 상대 경로일 경우 절대 경로로 변환
        const profilePath = path.join(__dirname, '../', userProfile);
        res.sendFile(path.resolve(profilePath));
    } else {
        res.status(404).json({ error: "Profile not found" });
    }
}

export const nameCheck = (req,res) => {
    const userName = req.query.nickname;
    if(!userName) {
        return res.status(400).send({message: "잘못된 닉네임입니다."});
    }
    try {
        const nameExists = getnameCheck(userName);
        if(nameExists) {
            console.log(nameExists);
            return res.status(200).send({exist : true});
        } else {
            return res.status(200).send({exist: false});
        }
    } catch(error) {
        return res.status(500).send({message : "닉네임 중복 체크 에러 : ", error: error.message})
    }
}

export const userLogin = async(req,res) => {
    const {email, password} = req.body;
    try {
        const user = await login(email, password);
        const userData = {email : user.email, nickname: user.nickname, profile : user.profile};
        res.cookie('userData', JSON.stringify(userData), {
            httpOnly : true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        });
        console.log('user logged in, setting cookie : ', userData);
        res.status(200).json({message : '로그인 성공', user:userData});
    }
    catch(err) {
        console.log(err.message);
        if (err.message.includes("비밀번호")) {
            res.status(401).send({message: err.message});
        } else if (err.message.includes("사용자")) {
            res.status(404).send({message: err.message});
        } else {
            res.status(500).send({message: "서버 로그인 에러"});
        }
    }
}

export const userLogout = (req,res) => {
    res.clearCookie('userData');
    console.log("user logged out");
    res.status(200).json({message: "로그아웃 성공"});
};