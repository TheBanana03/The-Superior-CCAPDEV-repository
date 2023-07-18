const express = require('express');
const User = require('../models/user');

const router = express.Router();

router
    .route('/')
    .get((req, res) => {
        const user = req.session.user;

        res.render('editprofile', {
            title: 'Animo Edit Profile',
            user: user
        });
    })
    .post(async (req, res) => {
        //TODO
    });

module.exports = router;