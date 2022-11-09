const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('./database');
const {
  authorization,
  adminAuthorization,
} = require('./middleware/authorization');
const { validateSession } = require('./middleware/validateSession');
const {
  addMinutes,
  createAndFormatDate,
  createIsoDate,
} = require('./helpers/helpers');

require('dotenv').config();

const app = express();

const port = process.env.PORT;

const whitelist = ['http://localhost:3000'];

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: whitelist }));

// Uncomment to init defaultRoles
// db.initRoles();

app.post('/api/login', async (req, res) => {
  try {
    console.log('LOGIN BODY:', req.body);
    const email = req.body.email;
    let password = req.body.password;
    // 1. Check if user already exists
    const user = await db.getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // 2. Compare password
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // 3. Get User Roles
    const roles = await db.getRolesForUser(user.userId);

    // 4. Create session
    const sessionId = await db.createSession(
      user.userId,
      createAndFormatDate()
    );

    // 5. Create refresh & accessTokens
    const accessToken = jwt.sign(
      {
        email: email,
        id: user.userId,
        roles: roles.map((val) => val.rolename),
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        audience: 'admin',
        expiresIn: '1m',
        issuer: user.username,
      }
    );
    const refreshToken = jwt.sign(
      { id: sessionId },
      process.env.REFRESH_TOKEN_SECRET,
      {
        audience: 'http://localhost:3000',
        expiresIn: '1d',
        issuer: user.username,
      }
    );
    // 6. Set accessToken cookie and return data
    return res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: addMinutes(1),
        maxAge: addMinutes(1),
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: addMinutes(15),
        maxAge: addMinutes(15),
      })
      .status(200)
      .json({
        userId: user.userId,
        email: email,
        username: user.username,
        roles: roles.map((val) => val.rolename),
      });
  } catch (err) {
    console.log('Error in login route: ', err);
    return res.sendStatus(400);
  }
});

app.post('/api/register', async (req, res) => {
  try {
    // 0. Get data from body
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
    // // 4. Assign ROLE to USER
    await db.assignRoleToUser(userId, 1000);
    // await db.assignRoleToUser(userId, 2000);
    // 5. Get ROLES for USER
    const roles = await db.getRolesForUser(userId);
    // 6. Create a session
    const sessionId = await db.createSession(userId, createAndFormatDate());
    // 7. Create refresh & accessTokens
    const accessToken = jwt.sign(
      { email: email, id: userId, roles: roles.map((val) => val.rolename) },
      process.env.ACCESS_TOKEN_SECRET,
      {
        audience: 'http://localhost:3000',
        expiresIn: '1m',
        issuer: username,
      }
    );
    const refreshToken = jwt.sign(
      { id: sessionId },
      process.env.REFRESH_TOKEN_SECRET,
      {
        audience: 'http://localhost:3000',
        expiresIn: '1d',
        issuer: username,
      }
    );
    return res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: addMinutes(1),
        maxAge: addMinutes(1),
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: addMinutes(15),
        maxAge: addMinutes(15),
      })
      .status(201)
      .json({
        userId: userId,
        email: email,
        username: username,
        roles: roles.map((val) => val.rolename),
      });
  } catch (err) {
    console.log('Error in register route: ', err);
    res.sendStatus(400);
  }
});

app.get('/api/refresh', validateSession, async (req, res) => {
  try {
    const sessionId = req.sessionId;
    const session = await db.getSessionById(sessionId);

    if (session.isRevoked) {
      return res
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .status(401)
        .json({ message: 'Session is expired cant renew' });
    }

    const user = await db.getUserById(session.userId);
    const roles = await db.getRolesForUser(session.userId);

    const accessToken = jwt.sign(
      {
        email: user.email,
        id: user.userId,
        roles: roles.map((val) => val.rolename),
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        audience: 'http://localhost:3000',
        expiresIn: '1m',
        issuer: user.username,
      }
    );

    return res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: addMinutes(1),
        maxAge: addMinutes(1),
      })
      .sendStatus(200);
  } catch (e) {
    console.log('ERR: ', e);
    return res
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .status(401)
      .json({ message: 'Session is expired cant renew' });
  }
});

app.get('/api/me', authorization, async (req, res) => {
  try {
    const userId = req.userId;
    const roles = req.userRoles;
    const user = await db.getUserById(userId);
    return res.status(200).json({
      username: user.username,
      email: user.email,
      roles: roles,
      userId: user.userId,
    });
  } catch (e) {
    return res.sendStatus(400);
  }
});

app.get('/api/users', adminAuthorization, async (req, res) => {
  try {
    const result = await db.getUsers();
    let duplicateList = result.filter((val) => val.rolename === 'NORMAL_USER');
    for (const index in result) {
      const user = result[index];
      let userMatch = duplicateList.find(
        (val) => val.userId === user.userId && val.rolename !== user.rolename
      );
      if (userMatch !== undefined) {
        userMatch.rolename += `,${user.rolename}`;
      }
    }
    // Removing roleId & password
    duplicateList.forEach((obj) => {
      obj.roles = obj.rolename.split(',');
      delete obj['roleId'];
      delete obj['password'];
      delete obj['rolename'];
    });

    res.status(200).json(duplicateList);
  } catch (err) {
    res.sendStatus(400);
  }
});

app.get('/api/user', authorization, async (req, res) => {
  const userId = req.query.id;
  const user = await db.getUserById(userId);
  const roles = await db.getRolesForUser(userId);
  return res.status(200).json({
    userId: user.userId,
    email: user.email,
    username: user.username,
    roles: roles.map((val) => val.rolename),
  });
});

app.get('/api/logout', authorization, validateSession, async (req, res) => {
  const sessionId = req.sessionId;
  const userId = req.userId;
  const result = await db.revokeSession(
    sessionId,
    userId,
    createAndFormatDate()
  );
  console.log('REVOKED SESSION: ', result);
  return res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .status(200)
    .json({ message: 'Successfully logged out!!' });
});

app.post('/api/recipe', authorization, async (req, res) => {
  const userId = req.userId;
  const title = req.body.title;
  const description = req.body.description;
  const createdAt = createAndFormatDate();

  try {
    const recipeId = await db.createRecipe(title, description, createdAt);
    await db.assignUserIdToRecipe(userId, recipeId);
    return res.sendStatus(200);
  } catch (e) {
    return res.sendStatus(400);
  }
});

app.get('/api/recipes', authorization, async (req, res) => {
  try {
    const recipes = await db.getRecipes();
    return res.status(200).json(recipes);
  } catch (e) {
    console.log('Error getting recipes: ', e);
    return res.sendStatus(400);
  }
});

app.post('/api/revokeSession', async (req, res) => {
  const { sessionId, userId } = req.body;
  console.log(sessionId);
  console.log(userId);
  try {
    const result = await db.revokeSession(
      sessionId,
      userId,
      createAndFormatDate()
    );
    console.log('SESSION RESULT: ', result);
    return res.status(200).json({ message: 'Session is revoked' });
  } catch (e) {
    console.log('Error getting recipes: ', e);
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
