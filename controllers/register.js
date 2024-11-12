const { signToken, setToken, createSessions } = require('./signin')

const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
            // loginEmail[0] --> this used to return the email
            // TO
            // loginEmail[0].email --> this now returns the email
            email: loginEmail[0].email,
            name: name,
            joined: new Date()
          })
          .then(user => {
            return trx.commit() // Commit the transaction
              .then(() => {
                return createSessions(user[0])
                  .then(session => {
                    console.log('session:', session)
                    res.json({ user: user[0], token: session.token })
                })
                // Create a session after committing
                // return createSessions(user[0]).then(session => {
                //   // Optionally, you can log or handle the session as needed
                // });
                // res.json(user[0])
              });
          });
          
          // .then(user => {
          //   res.json(user[0]);
          // })
      })
      .catch(err => {
        console.error('Transaction error:', err); // Log transaction error
        trx.rollback();
        res.status(400).json('unable to register');
      });
      // .then(trx.commit)
      // .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('.catch unable to register'))
}

module.exports = {
  handleRegister: handleRegister
};


