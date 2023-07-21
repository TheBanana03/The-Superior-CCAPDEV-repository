const express = require('express');
const Community = require('../models/community');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/');
});

router.post('/', async (req, res) => {
    const user = req.session.user;
    
    const community = new Community({
        name: req.body.name,
        tagline: req.body.tagline,
        description: req.body.description,
        creator: user._id
    });

    try {
        const newCommunity = await community.save();

        //make get route for /:id
        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.render('createcommunity', {
            title: 'Animo Create Community',
            user: user,
            community: community,
            error: 'Error creating community\n' + err
        });
    }
});

router.get('/create', (req, res) => {
    const user = req.session.user;
    
    res.render('createcommunity', {
        title: 'Animo Create Community',
        user: user
    });
});

module.exports = router;
    
