const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET;

exports = {};

// Generates a JWT token for the authenticated user using their unique identifier
exports.getToken = async (email, user) => {
    const token = jwt.sign({ identifier: user._id }, SECRET);
    return token;
}

module.exports = exports;
