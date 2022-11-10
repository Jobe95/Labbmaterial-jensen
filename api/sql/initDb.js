const mysql = require('mysql');

require('dotenv').config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
});

try {
  const sql = 'INSERT INTO Roles (roleId, rolename) VALUES ?';
  const query = mysql.format(sql, [
    [
      [1000, 'NORMAL_USER'],
      [2000, 'ADMIN_USER'],
    ],
  ]);

  db.query(query, (err) => {
    if (err) {
      console.log('ERROR Inserting Roles', err);
      process.exit(1);
    } else {
      console.log('Inserted Roles successfully');
      process.exit(0);
    }
  });
} catch (err) {
  process.exit(1);
}
