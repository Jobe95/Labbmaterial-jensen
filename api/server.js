const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database');

require('dotenv').config();

const app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uncomment to init defaultRoles
// db.initRoles();

app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    console.log(users);
    return res.status(200).json(users);
  } catch (err) {
    console.log('Error in getting users: ', err);
    return res.sendStatus(400);
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    if (isNaN(Number(id))) {
      return res.status(400).json({ message: 'ID need to be integer' });
    }
    const user = await db.getUserById(id);
    console.log(user);
    return res.status(200).json(user);
  } catch (err) {
    console.log('Error in getting users: ', err);
    return res.sendStatus(400);
  }
});

app.post('/api/user', async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    let password = req.body.password;
    // 1. Check for empty data
    if (!username || !email || !password) {
      return res.sendStatus(400);
    }
    // 2. Check if user already exists in DB
    const user = await db.getUserByEmail(email);
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }
    // 3. Hash password & Register USER
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await db.createUser(username, email, hashedPassword);

    // 4. Assign ROLE to USER
    // 5. Get ROLES for USER
    // 6. Set accessToken cookie and
    return res.status(200).json({
      userId: userId,
      email: email,
      username: username,
    });
  } catch (err) {
    console.log('Error in register user: ', err);
    return res.sendStatus(400);
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log(`Error listening on port: ${port}`, err);
  } else {
    console.log(`Succesfully listening on port: ${port}!`);
  }
});
