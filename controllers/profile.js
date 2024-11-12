const handleProfileGet = (req, res, db) => {
  const { id } = req.params; 
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
}

const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, age, pet, imageUrl } = req.body.formInput;
  console.log('imageUrl:', imageUrl);
  db('users')
    .where({ id })
    .update({ name, age, pet, imageurl: imageUrl })
    .then(resp => {
      console.log('Update response:', resp);
      if (resp) {
        res.json('success')
      } else {
        console.log('No rows updated. Response:', resp);
        res.status(400).json('unable to update')
      }      
    })
    .catch(err => {
      console.error('Error updating user:', err);
      res.status(400).json('error updating user') 
    })
}

module.exports = {
  handleProfileGet,
  handleProfileUpdate
}