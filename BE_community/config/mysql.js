import mysql from 'mysql2/promise';

const db_info = mysql.createPool({
    host: "localhost", // 데이터베이스 주소
    port: "3306", // 데이터베이스 포트
    user: "yeonsu", // 로그인 계정
    password: "2366", // 비밀번호
    database: "community", // 엑세스할 데이터베이스
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