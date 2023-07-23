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

//Go to Edit Community Page
router.get('/edit/:name', async (req, res) => {
    const community_name = req.params.name;
    const user = req.session.user;
    
    try {
        const community = mongooseToObj(await Community.findOne({ name: community_name }));

        res.render('editcommunity', {
            title: 'Animo Edit Community',
            user: user,
            community: community
        });
    
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
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

//Delete Community
router.delete('/:name', async (req, res) => {
    const community_name = req.params.name;
    const user = req.session.user;

    try {
        const community = await Community.findOne({ name: community_name });
        community.remove();

        if (result.deletedCount == 0) {
            return res.render('editcommunity', {
                title: 'Animo Edit Community',
                user: req.session.user,
                error: 'Error deleting Community'
            });
        }

        res.redirect('/');

    } catch(err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//Edit Community
router.post('/:name', async (req, res) => {
    const community_name = req.params.name;
    const user = req.session.user;
    
    const { name, tagline, description } = req.body;

    try {
        const community = await Community.findOne({ name: community_name });

        if (!community) {
            return res.render('editcommunity', {
                title: 'Animo Edit Community',
                user: req.session.user,
                error: 'Community not found'
            });
        }

        community.name = name;
        community.tagline = tagline;
        community.description = description;

        await community.save();
        res.redirect('/community/' + name);

    } catch (err) {
        console.error(err);

        const editCommunity = new Community({
            name: name,
            tagline: tagline,
            description: description
        });

        res.render('editcommunity', {
            title: 'Animo Edit Community',
            user: req.session.user,
            community: editCommunity,
            error: 'Error updating community\n' + err
        });
    }
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
        res.redirect('/community/' + newCommunity.name);

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
    
