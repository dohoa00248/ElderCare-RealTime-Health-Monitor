import express from 'express';
import User from '../model/user.model.js';
import mongoose from 'mongoose';
const router = express.Router();

router.get('/', async (req, res) => {
    // res.send('Hello World');
    const users = await User.find();
    res.render('user.ejs', { users: users });

    // const user = await User.findOne();
    // res.render('user.ejs', { user: user });
});

router.post('/create', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username: username, password: password });
    try {
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ status: false, message: 'Error creating user.', error: error });
    }
});

router.get('/users/:userId', async (req, res) => {
    const user = await User.findById(req.params.userId);
    try {
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ status: false, message: 'Error finding user.', error: error });
    }

});

router.put('/update/:userId', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    try {
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ status: false, message: 'Error updating user.', error: error });
    }
});

router.delete('/delete/:userId', async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.userId);
    try {
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ status: false, message: 'Error updating user.', error: error });
    }
});


export default router