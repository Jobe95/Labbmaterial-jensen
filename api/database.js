const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

let db = {};

db.initRoles = () => {
  const sql = 'INSERT INTO Roles (roleId, rolename) VALUES ?';
  const query = mysql.format(sql, [
    [
      [1000, 'NORMAL_USER'],
      [2000, 'ADMIN_USER'],
      [3000, 'SUPER_USER'],
    ],
  ]);
  pool.query(query, (err) => {
    if (err) {
      console.log('ERROR Inserting Roles', err);
    } else {
      console.log('Inserted Roles successfully', err);
    }
  });
};

db.getUsers = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Users';
    const query = mysql.format(sql);
    pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

db.getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Users WHERE email = ?';
    const query = mysql.format(sql, [email]);
    pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result[0]);
    });
  });
};

db.getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT userId, email, username FROM Users WHERE userId = ?';
    const query = mysql.format(sql, [userId]);
    pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result[0]);
    });
  });
};

db.createUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    const sql =
      'INSERT INTO Users (userId, username, email, password) VALUES (?)';
    const query = mysql.format(sql, [[null, username, email, password]]);
    pool.query(query, async (err, result) => {
      if (err) {
        return reject(err);
      }
      console.log(result);
      return resolve(result.insertId);
    });
  });
};

module.exports = db;
