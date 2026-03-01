const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});

console.log("ENV CHECK:", {
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI,
});
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cors = require('cors');

const SECRET = process.env.JWT_SECRET;
const URL = process.env.MONGO_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not found in environment variables. Receipt processing will not work.');
}

const User = require('./models/UserSchema');
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expense');
const incomeRoutes = require('./routes/income');
const receiptRoutes = require('./routes/receipts');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
    origin: ['http://localhost:3000', 'https://expense-manager-uzof.vercel.app'],
    credentials: true
}));
app.use(express.json());


app.get("/", (req, res) => {
    res.send('Hello world');
});

app.use('/auth', authRoutes);
app.use('/expense', expenseRoutes);
app.use('/income', incomeRoutes);
app.use('/receipts', receiptRoutes);

mongoose.connect(URL).then((x) => {
    console.log('Connected to the database');
}).catch((err) => {
    console.log(err);
    console.log('Error connecting to the database');
});

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET;

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload.identifier }).then(function (user) {
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }).catch((err) => {
        return done(err, false);
    });
}));

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});
