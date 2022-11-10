const jwt = require('jsonwebtoken');
require('dotenv').config();

const authorization = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.sendStatus(401);
  }
  try {
    const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log('DATA I ACCESSTOKEN: ', data);
    req.userId = data.id;
    req.userRoles = data.roles;
    req.email = data.email;
    return next();
  } catch (e) {
    console.log('ERROR VERIFY TOKEN: ', e);
    return res.sendStatus(401);
  }
};

const adminAuthorization = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.sendStatus(401);
  }
  try {
    const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!data.roles.includes('ADMIN_USER')) {
      return res.sendStatus(403);
    }
    req.userId = data.id;
    req.userRoles = data.roles;
    req.email = data.email;
    return next();
  } catch (e) {
    return res.sendStatus(401);
  }
};

module.exports = { authorization, adminAuthorization };
