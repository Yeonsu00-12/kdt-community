// api/user.js
import db_info from '../config/mysql.js';
import bcrypt from 'bcrypt';
import path from 'path';

export const getUserByEmail = async (email) => {
    try {
        const [results] = await db_info.query('SELECT * FROM users WHERE email = ?', [email]);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error('Error fetching user by email: ', error);
        throw new Error('Error fetching user by email: ' + error);
    }
};

export const getProfile = async (userEmail) => {
    const user = await getUserByEmail(userEmail);
    return user ? user.profileImage : null;
}

export const getEmailCheck = async (emailToCheck) => {
    const user = await getUserByEmail(emailToCheck);
    return !!user;
};

export const getnameCheck = async (nameToCheck) => {
    try {
        const [results] = await db_info.query('SELECT * FROM users WHERE nickname = ?', [nameToCheck]);
        return results.length > 0;
    } catch (error) {
        console.error('Error fetching user by nickname: ', error);
        throw new Error('Error fetching user by nickname: ' + error);
    }
};

export const signup = async ({ email, password, nickname, profileFilename }) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const profileUrl = path.join('uploads', 'profile', profileFilename);

        const query = 'INSERT INTO users (email, password, nickname, profileImage, created_At, updated_At) VALUES (?, ?, ?, ?, NOW(), NOW())';
        const [result] = await db_info.query(query, [email, hashedPassword, nickname, profileUrl]);

        return {
            id: result.insertId,
            email,
            password: hashedPassword,
            nickname,
            profile: profileUrl
        };
    } catch (error) {
        console.error('Error signing up: ', error);
        throw new Error('Error signing up: ' + error);
    }
};

export const login = async (email, password) => {
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }
        const matching = await bcrypt.compare(password, user.password);
        if (!matching) {
            throw new Error("비밀번호가 틀립니다!");
        }
        return user;
    } catch (error) {
        console.error('Error logging in: ', error);
        throw new Error('Error logging in: ' + error);
    }
};
