// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const userModel = require('../models/userModel');
// const dotenv = require('dotenv');

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { configDotenv } from 'dotenv';

configDotenv();
// dotenv.config();

const login = (req, res) => {
    const { username, password } = req.body;

    const user = userModel.findUserByUsername(username);
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
};

const dashboard = (req, res) => {
    res.render('dashboard', { username: req.user.username });
};

// module.exports = { login, dashboard };

export default {
    login,
    dashboard
}
