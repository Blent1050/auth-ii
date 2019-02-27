//Dependencies
const express = require('express'),
  helmet = require('helmet'),
  cors = require('cors'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken');

//Server to point to
const server = express();

//Models
const Users = require('./users/user-model');

//Library Middleware
server.use(helmet(), express.json(), cors());
//Customer Middleware
const { restricted, checkRole, generateToken } = require('./Auth/restricted');

//Default Endpoints
server.get('/', (req, res) => {
  res.send('It works!');
});

//API Endpoints

server.post('/api/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);

  user.password = hash;
  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => res.status(500).json(err));
});
server.post('/api/login', (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: 'Welcome!',
          token,
          roles: token.roles,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    });
});

server.get('/api/users', restricted, checkRole('owner'), (req, res) => {
  Users.find()
    .then(users => {
      res.json({ users, decodedToken: req.decodedJwt });
    })
    .catch(err => res.send(err));
});

module.exports = server;
