import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db_info = mysql.createPool({
    host: process.env.DB_HOST, // 데이터베이스 주소
    port: process.env.DB_PORT, // 데이터베이스 포트
    user: process.env.DB_USER, // 로그인 계정
    password: process.env.DB_PASSWORD, // 비밀번호
    database: process.env.DB_DATABASE, // 엑세스할 데이터베이스
});

db_info.getConnection()
    .then(connection => {
        console.log("connected to the mysql database.");
        connection.release();
    })
    .catch(err => {
        console.error('error connecting to the database : ', err);
    }
);

export default db_info;