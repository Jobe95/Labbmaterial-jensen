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

// CREATE TABLES

db.connect(async (err, connection) => {
  console.log('RUNNING CREATE TABLE SCRIPT');
  let createUsersTable = `CREATE TABLE IF NOT EXISTS Users (
    userId int NOT NULL AUTO_INCREMENT,
    email varchar(100) NOT NULL, 
    username varchar(45) NOT NULL, 
    password varchar(100) NOT NULL, 
    PRIMARY KEY (userId)) 
    ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `;
  let createRolesTable = `CREATE TABLE IF NOT EXISTS Roles (
    roleId int NOT NULL AUTO_INCREMENT,
    rolename varchar(45) NOT NULL,
    PRIMARY KEY (roleId)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

  let createUsersWithRoleTable = `CREATE TABLE IF NOT EXISTS UsersWithRoles (
    userId int NOT NULL,
    roleId int NOT NULL,
    CONSTRAINT FK_Role FOREIGN KEY (roleId) REFERENCES Roles(roleId),
    CONSTRAINT FK_User FOREIGN KEY (userId) REFERENCES Users(userId)
    ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;

  let createRecipeTable = `CREATE TABLE IF NOT EXISTS Recipe (
      id int NOT NULL AUTO_INCREMENT,
      title varchar(45) NOT NULL,
      description varchar(100),
      createdAt date NOT NULL,
      updatedAt date,
      PRIMARY KEY (id) 
      ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      `;

  let createRecipeWithOwner = `CREATE TABLE IF NOT EXISTS RecipeWithOwner (
        userId int NOT NULL,
        recipeId int NOT NULL,
        CONSTRAINT FK_UserId FOREIGN KEY (userId) REFERENCES Users(userId),
        CONSTRAINT FK_Recipe FOREIGN KEY (recipeId) REFERENCES Recipe(id)
        ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
        `;

  db.query(createUsersTable, async (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    console.log('USER TABLE CREATED!');
    db.query(createRolesTable, async (err) => {
      if (err) {
        process.exit(1);
      }
      console.log('ROLES TABLE CREATED!');
      db.query(createUsersWithRoleTable, async (err) => {
        if (err) {
          process.exit(1);
        }
        console.log('USER WITH ROLES TABLE CREATED!');
        db.query(createRecipeTable, async (err) => {
          if (err) {
            process.exit(1);
          }
          console.log('RECIPE TABLE CREATED!');
          db.query(createRecipeWithOwner, async (err) => {
            if (err) {
              console.log(err);
              process.exit(1);
            }
            console.log('RECIPE WITH OWNER TABLE CREATED!');
            process.exit(0);
          });
        });
      });
    });
  });
});
