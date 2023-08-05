const express = require('express');
const User = require('../models/user');
const { comparePassword } = require('../hashPassword');

const router = express.Router();

router
    .route('/')
    // Goto login page
    .get((req, res) => {
        res.render('login', {
            title: 'Animo Login'
        });
    })
    // Login
    .post(async (req, res) => {
        const user = await User.findOne({ username: req.body.username.toLowerCase() });
        if (user == null) {
            return res.render('login', {
                title: 'Animo Login',
                error: 'User not found'
            });
        }

        const checkPass = await comparePassword(req.body.password, user.password);

        if (checkPass) {
            req.session.user = user;
            req.session.authenticated = true;
            return res.redirect('/');
        }

        res.render('login', {
            title: 'Animo Login',
            error: 'Incorrect Password'
        });
    });

module.exports = router;
