const express = require('express');
const User = require('../models/user');
const { hashPassword } = require('./hashPassword');

const router = express.Router();

router
    .route('/')
    .get((req, res) => {
        res.render('signup', {
            title: 'Animo Signup',
            user: new User()
        });
    })
    .post(async (req, res) => {
        const existingUser = await User.findOne({ username: req.body.username });

        if (req.body.username.length < 3 || req.body.username.length > 16) {
            res.render('signup', {
                title: 'Animo Signup',
                user: req.body,
                usernameError: 'Username must be between 3 and 16 characters long'
            });
            return;
        }

        if (existingUser) {
            res.render('signup', {
                title: 'Animo Signup',
                user: req.body,
                usernameError: 'Username already exists'
            });
            return;
        }

        const hashedPassword = await hashPassword(req.body.password);

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            followed_communities: []
        });

        try {
            const newUser = await user.save();
            res.redirect('/login');
        } catch (err) {
            res.render('signup', {
                title: 'Animo Signup',
                user: user,
                error: err
            });
        }
    });

// Check if the provided username already exists
router.get('/checkUsername', async function (req, res) {
    const { username } = req.query;
    try {
        const user = await User.findOne({ username });
        res.json({ exists: !!user });
    } catch (error) {
        console.error('An error occurred while checking username:', error);
        res.status(500).send('An error occurred while checking username');
    }
});

module.exports = router;