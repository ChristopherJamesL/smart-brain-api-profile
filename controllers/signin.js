const jwt = require('jsonwebtoken');
const redis = require("redis");

// //setup Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URI,
  legacyMode: true
});

async function redisConnect() {
  let retries = 5;
  while (retries) {
    try {
      await redisClient.connect();
      console.log("Connected to Redis");
      break; // Break out of the loop if connected
    } catch (err) {
      console.error("Redis Client Error", err);
      retries--;
      console.log(`Retrying to connect to Redis... (${retries} retries left)`);
      await new Promise(res => setTimeout(res, 5000)); // Wait before retrying
    }
  }
}

redisConnect()



const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        return Promise.reject('wrong credentials')
      }
    })
    .catch(err => Promise.reject('wrong credentials'))
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json(`Unauthorized`);
    }
    return res.json({id: reply})
  })
}

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days'});
}

const setToken =  (key, value) => {
  return Promise.resolve(redisClient.set(key, value))
}

const createSessions = async (user) => {
  //JWT Token, return user data
  const { email, id, } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => { 
      console.log('token:',token);
      return {success: 'true', userId: id, token }
    })
    .catch(console.log)
}

const signInAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? 
    getAuthTokenId(req, res) : 
    handleSignin(db, bcrypt, req, res)
      .then(data => {        
        return data.id && data.email ? createSessions(data) : Promise.reject(data)
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err));
}

module.exports = {
  signInAuthentication: signInAuthentication,
  redisClient: redisClient,
  createSessions: createSessions
}
