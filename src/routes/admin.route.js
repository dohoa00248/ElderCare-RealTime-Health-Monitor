import express from 'express';
import User from '../model/user.model.js';
const router = express.Router();

router.get('/', async (req, res) => {
    // res.send('Hello administration');
    const users = await User.find();
    try {
        // res.status(200).json(users);
        res.render('admin.ejs', { users: users });
    } catch (error) {
        res.status(400).json({ status: false, message: 'Error finding users.', error: error });
    }

})

export default router;