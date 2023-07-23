const express = require('express');
const Community = require('../models/community');
const User = require('../models/user');
const { mongooseToObj, multipleMongooseToObj } = require('../models/db');

const router = express.Router();

//Go to Home Page 
router.get('/', (req, res) => {
    res.redirect('/');
});

//Go to Create Community Page
router.get('/create', (req, res) => {
    const user = req.session.user;
    
    res.render('createcommunity', {
        title: 'Animo Create Community',
        user: user
    });
});

//Go to Community Page
router.get('/:name', async (req, res) => {
    const name = req.params.name;
  
    try {
        const community = mongooseToObj(await Community.findOne({ name }));
  
        if (!community) {
            return res.render('404', {
                title: '404'
            });
        }

        const community_follower_count = await User.countDocuments({ followed_communities: community._id });
  
        res.render('community', {
            title: `${community.name}`,
            user: req.session.user,
            community: community,
            community_follower_count: community_follower_count
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//Go to Edit Community Page
router.get('/:name/edit', async (req, res) => {
    const name = req.params.name;
    const user = req.session.user;
});

//Create Community
router.post('/', async (req, res) => {
    const user = req.session.user;
    
    const community = new Community({
        name: req.body.name,
        tagline: req.body.tagline,
        description: req.body.description,
        coverphoto: req.session.filename,
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

module.exports = router;
    
