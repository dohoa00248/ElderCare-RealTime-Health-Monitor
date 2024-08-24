import express from 'express';
import User from '../model/user.model.js';
const router = express.Router();

router.get('/', (req, res) => {
    // res.send('Hello World');
    res.render('user.ejs');
})

router.post('/', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ status: false, message: 'Error creating user.', error: error });
    }
})

export default router