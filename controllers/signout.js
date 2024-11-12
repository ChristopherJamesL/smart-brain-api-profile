const { redisClient } = require('./signin');

const handleSignOut = (req, res) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.json('Sign out successful, no token found');
    }
    redisClient.del(authorization, (err, reply) => {
        if (err) {
            return res.status(400).json('unable to remove token due to an error');
        }
        if (!reply) {
            return res.json('Sign out successful, token not found in redis')
        }
        return res.json('Sign out successful, token removed')
    });
}

module.exports = {
    handleSignOut
};