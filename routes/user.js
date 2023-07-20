const express = require('express');
const User = require('../models/user');
const Community = require('../models/community');

const router = express.Router();

router
    .route('/')
    // Goto logged in user profile page
    .get((req, res) => {
        //check if logged in, redirect to login page if not
        if (!req.session.user) {
            res.redirect('/login');
        }
        else {
            res.render('user', {
                title: req.session.user.username + '\'s Profile',
                user: req.session.user
            });
        }
    });

module.exports = router;