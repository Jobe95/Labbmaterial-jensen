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
    const sql =
      'SELECT * FROM Users u INNER JOIN UsersWithRoles uwr ON u.userId = uwr.userId INNER JOIN Roles r ON r.roleId = uwr.roleId';
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

db.getRolesForUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql =
      'SELECT Roles.roleId, Roles.rolename FROM UsersWithRoles INNER JOIN Roles ON Roles.roleId = UsersWithRoles.roleId WHERE UsersWithRoles.userId = ?';
    const query = mysql.format(sql, [userId]);
    pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

db.assignRoleToUser = (userId, roleId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO UsersWithRoles (userId, roleId) VALUES (?, ?)';
    const query = mysql.format(sql, [userId, roleId]);
    pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

db.deleteRecipe = (recipeId) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM Recipe WHERE id = ?`;
    const query = mysql.format(sql, [recipeId]);
    console.log(query);
    pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

db.createRecipe = (title, description, createdAt) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Recipe (id, title, description, createdAt) VALUES (?, ?, ?, ?)`;
    const query = mysql.format(sql, [
      null,
      title,
      description,
      createdAt,
      null,
    ]);
    pool.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result.insertId);
    });
  });
};

db.assignUserIdToRecipe = (userId, recipeId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO RecipeWithOwner (userId, recipeId) VALUES (?, ?)';
    const query = mysql.format(sql, [userId, recipeId]);
    pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

db.getRecipes = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Recipe';
    const query = mysql.format(sql);
    pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

db.createSession = (userId, createdAt) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Sessions (userId, createdAt) VALUES (?, ?)';
    const query = mysql.format(sql, [userId, createdAt]);
    pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result.insertId);
    });
  });
};

db.getSessionById = (sessionId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Sessions WHERE id = ?';
    const query = mysql.format(sql, [sessionId]);
    pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result[0]);
    });
  });
};

db.getSessionsForUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Sessions WHERE userId = ?';
    const query = mysql.format(sql, [userId]);
    pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

db.revokeSession = (sessionId, userId, revokedAt) => {
  return new Promise((resolve, reject) => {
    const sql =
      'UPDATE Sessions SET isRevoked = ?, revokedAt = ? WHERE id = ? AND userId = ?';
    const query = mysql.format(sql, [true, revokedAt, sessionId, userId]);
    pool.query(query, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

module.exports = db;
