// signup.js
const express = require('express');
const User = require('../models/user');
const { hashPassword } = require('../hashPassword'); // Update the path

const router = express.Router();

router
    .route('/')
    // Goto signup page
    .get((req, res) => {
        res.render('signup', {
            title: 'Animo Signup',
            user: new User()
        });
    })
    // Signup
    .post(async (req, res) => {
        const hashedPassword = await hashPassword(req.body.password);

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            followed_communities: []
        });

        // Insert Data Validation Here
        // console.log(user);

        try {
            const newUser = await user.save();
            // console.log("NEW USER: ", newUser);
            res.redirect('/login');
        } catch (err) {
            res.render('signup', {
                title: 'Animo Signup',
                user: user,
                error: err
            });
        }
    });

module.exports = router;
