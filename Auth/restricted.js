const jwt = require('jsonwebtoken');

//JWT Secret
const secret = process.env.JWT_SECRET || 'my secret';

module.exports = {
  restricted,
  checkRole,
  generateToken,
};

//Restricts the route. Requiring user token.
function restricted(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    // is it valid?
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        // record the event
        res.status(401).json({ you: "can't touch this!" });
      } else {
        console.log(decodedToken);
        req.decodedJwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ you: 'shall not pass!' });
  }
}
//Checks the role. If the role is valid, user can access info.
function checkRole(department) {
  return function(req, res, next) {
    console.log(req.decodedJwt);
    if (req.decodedJwt.roles && req.decodedJwt.roles.includes(department)) {
      next();
    } else {
      res.status(403).json({ you: 'you have no power here!' });
    }
  };
}

//Generates a token for the user
function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    roles: ['owner'],
  };

  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, secret, options);
}
