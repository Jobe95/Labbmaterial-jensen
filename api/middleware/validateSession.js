const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateSession = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Cant find refreshToken' });
  }
  try {
    const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    req.sessionId = data.id;
    return next();
  } catch (e) {
    console.log('ERROR VERIFY TOKEN: ', e);
    return res.sendStatus(401);
  }
};

module.exports = { validateSession };
