require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const signout = require('./controllers/signout');
const auth = require('./controllers/authorization');


const db = knex({ 
  // connect to your own database here:
  client: 'pg',
  connection: process.env.POSTGRES_URI
});

const app = express();

app.use(cors())
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!
app.use(morgan('combined'));
const PORT = 3000;

// bcrypt.hash(***ENTER PASSWORD HERE***, null, null, (err, hash) => {
//   if (err) throw err;
//   console.log(hash); // Use this hash in your seed.sql
// });

app.get('/', (req, res)=> { res.send("It's Working") })
app.post('/signin', signin.signInAuthentication(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db)})
app.post('/profile/:id', auth.requireAuth, (req, res) => {profile.handleProfileUpdate(req, res, db)})
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res)})
app.post('/signout', signout.handleSignOut);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App is running on port ${PORT}`);
});