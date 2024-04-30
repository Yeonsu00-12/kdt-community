import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt'

let __dirname = path.resolve();
const userFilePath = path.join(__dirname, '/api/user.json');

const readUser = () => {
    try {
        const userFile = fs.readFileSync(userFilePath, 'utf8');
        const parsedData = JSON.parse(userFile);
        return parsedData.users;
    } catch(error) {
        console.error('유저 정보를 읽지 못헀습니다.', error);
        return [];
    }
}

export const getEmailCheck = (emailToCheck) => {
    const users = readUser();
    return users.some(user => user.email === emailToCheck);
};

export const getnameCheck = (nameToCheck) => {
    const name = readUser();
    return name.some(user => user.nickname === nameToCheck);
};

export const signup = async({email,password,nickname,profileFilename}) => {
    try {
        const userFile = fs.readFileSync(userFilePath, 'utf8');
        const parsedData = JSON.parse(userFile);

        const users =  parsedData.users;
        const newMemberId = users.length ? parseInt(users[users.length -1].id) +1 : 1;
        const hashedPasword = await bcrypt.hash(password, 10);
        const profileUrl = path.join('uploads','profile', profileFilename);

        const newUser = {
            id : newMemberId,
            email : email,
            password : hashedPasword,
            nickname : nickname,
            profile : profileUrl
        };

        users.push(newUser);
        fs.writeFileSync(userFilePath, JSON.stringify(parsedData, null,2), 'utf8');
        return newUser;
    } catch(error) {
        console.log('회원가입 실패 : ', error);
        throw error;
    }
}

export const login = async(email, password) => {
    try{
        const userFile = fs.readFileSync(userFilePath, 'utf8');
        const userData = JSON.parse(userFile);
        const users = userData.users;
        const user = users.find(u => u.email === email);
        if(!user) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }
        const matching = await bcrypt.compare(password, user.password);
        if(!matching){
            throw new Error("비밀번호가 틀립니다!");
        }
        return user;
    }
    catch(error) {
        console.error('로그인 에러 : ', error);
        throw error;
    }
}