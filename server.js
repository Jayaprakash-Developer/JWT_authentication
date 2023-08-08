require('dotenv').config()

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')

app.use(express.json());


const allUsers = [
  {
    username: "Kyle",
    password: "kyle12345",
  },
  {
    username: "Jim",
    password: "jim12345",
  },
  {
    username: "Naruto",
    password: "Nai12345",
  },  
];

// app.get("/", authenticateToken,(req, res) => {
//     res.json(allUsers.filter(allUsers => allUsers.username === req.user.name));
// });

app.get("/", authenticateToken, (req, res) => {
  const authenticatedUser = allUsers.find(user => user.username === req.user.name);

  if (!authenticatedUser) {
    return res.status(403).json({
      error: {
        message: "User not authorized"
      }
    });
  }

  res.json(authenticatedUser);
});

// app.post('/login',(req, res) => {
//   const username = req.body.username     //1
//   const user = {name: username}     //1

//   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)   //1
//     res.json({accessToken : accessToken})   //1
// });

app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = allUsers.find(find_user => find_user.username === username);

  if (!user) {
    return res.status(401).json({
      error: {
        message: "User not Found in your Database"
      }
    });
  }

  const accessToken = jwt.sign({ name: user.username }, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3001, () => console.log('Server running on http://localhost:3001'));

