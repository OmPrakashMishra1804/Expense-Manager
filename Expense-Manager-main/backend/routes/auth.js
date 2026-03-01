const express = require('express');
const router = express.Router();
const User = require('../models/UserSchema');
const bcrypt = require('bcrypt');
const { getToken } = require('../utils/helpers');

router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(403).json({ error: "A user with this email already exists" });
        }
        // Hash the password before saving for security
        const hashPass = await bcrypt.hash(password, 10);
        let user = new User({ name, email, password: hashPass});
        await user.save();
        const userToReturn = { ...user.toJSON() };
        delete userToReturn.password;
        res.status(200).json({ user: userToReturn, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error", success: false });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(403).json({ error: 'Enter valid Credentials' });
        }
        // Compare the provided password with the hashed password in the database
        const isValidPass = await bcrypt.compare(password, user.password);
        if (!isValidPass) {
            return res.status(403).json({ error: 'Enter valid Credentials' });
        }
        // Generate JWT token for authenticated user
        const token = await getToken(user.email, user);
        const userToReturn = { ...user.toJSON(), token };
        delete userToReturn.password;
        return res.status(200).json({success: true, data: userToReturn, token: token});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error", success: false });
    }
});

module.exports=router;


