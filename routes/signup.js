const express = require('express');

const User = require('../models/user');

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
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        // Insert Data Validation Here
        //console.log(user);

        try {
            const newUser = await user.save();
            //console.log("NEW USER: ", newUser);
            res.redirect('/');

        } catch {
            res.render('signup', {
                title: 'Animo Signup',
                user: user,
                error: 'Error Creating User'
            });
        }
    });
module.exports = router;