const User = require('../models/user.js')
const jwt = require('jsonwebtoken');
const secret = process.env.JWTSECRET;

// middleware that checks for jwt token

async function createTokens(user, secret, secret2) {

  const createToken = await jwt.sign({id: user._id}, process.env.JWTSECRET, {
    expiresIn: '1m', // in seconds
    algorithm: 'HS256'
  });

  const createRefreshToken = await jwt.sign({id: user._id}, process.env.JWTSECRET2 + user.password, {
      expiresIn: '7d', // in seconds
      algorithm: 'HS256'
    });

  return Promise.all([createToken, createRefreshToken]);
};

// generates refreshToken
async function refreshTokens(refreshToken, secret, secret2) {
  let userId = -1;
  let user;

  try {
    user = jwt.decode(refreshToken)
  } catch (err) {
    return {}
  }
  if (user == null) {
    return {}
  }

  user = await User.find({_id: user.id})
  if (!user) {
    return {}
  }

  const refreshSecret = secret2 + user[0].password

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {}
  }
  const [newToken, newRefreshToken] = await createTokens(user[0], secret, refreshSecret);

  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user
  }
};

function isEmpty(obj) {
    return !obj || Object.keys(obj).length === 0;
}
const withAuth = async function(req, res, next) {
  const token = req.headers['authorization'] || ''
  const refreshToken = req.headers['x-refresh-token'] || ''
  if (!token && !refreshToken) {
    console.log("----if----Unauthorized, No token and no refresh token provided-------");
    return res.status(401).json({data: '', message:'Unauthorized, No token and no refresh token provided', status: 401 });
  } else {
      const split_token = token.split(' ')[1]
    try {
      const { id, role, email } = jwt.verify(split_token, process.env.JWTSECRET)
      //access token on frontend by req.user_id
      req.user_id = id;
      req.user_role = role;
      req.user_email = email;

      next();

      console.log("----else- try---Unauthorized, No token and no refresh token provided-------");

    } catch(err) {
        const newTokens = await refreshTokens(refreshToken, process.env.JWTSECRET, process.env.JWTSECRET2)
        if (isEmpty(newTokens)) {
          return res.status(401).json({data: '', message:'Unauthorized, unable to authenticate the user', status: 401 });
        }
        if (newTokens.token && newTokens.refreshToken) {
          res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
          res.set('x-token', newTokens.token);
          res.set('x-refresh-token', newTokens.refreshToken);
        }

        const currentUser = jwt.decode(newTokens.token); // add the user id within request
        req.user_id = currentUser.id;
        // req.user = newTokens.user
        next();
      }
    }
  };


  module.exports = {
    withAuth
  }
