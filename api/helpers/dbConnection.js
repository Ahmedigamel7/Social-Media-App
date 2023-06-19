import mysql from "mysql2";
const db = mysql.createConnection({
    host: "localhost",
    password: "!777H111m@",
    user: "root",
    database: "social-app",
    connectTimeout: 20000
});

export default db;
