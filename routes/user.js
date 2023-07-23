const express = require('express');
const User = require('../models/user');
// const Community = require('../models/community');
const { mongooseToObj, multipleMongooseToObj } = require('../models/db');

const router = express.Router();

router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    else {
        res.render('user', {
            title: req.session.user.username + '\'s Profile',
            user: req.session.user,
            viewUser: req.session.user
        });
    }
});

router.get('/:username', async (req, res) => {
    const username = req.params.username;
    
    try {
        const viewUser = mongooseToObj(await User.findOne({ username }));
    
        if (!viewUser) {
            return res.render('404', {
                title: '404'
            });
        }
    
        res.render('user', {
            title: `${username}'s Profile`,
            user: req.session.user,
            viewUser: viewUser
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;