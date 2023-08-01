const express = require('express');
const Community = require('../models/community');
const User = require('../models/user');
const Post = require('../models/post');
const { mongooseToObj, multipleMongooseToObj } = require('../models/db');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/assets/coverpics/')); // Specify the directory where the uploaded files will be saved.
    },
      filename: (req, file, cb) => {
          cb(null, Date.now() + req.session.user._id);
      }
  });

const upload = multer({ storage: storage });

//Go to Home Page 
router.get('/', (req, res) => {
    res.render('404');
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

        const posts = multipleMongooseToObj(
            await Post.find({ community: community._id })
              .populate('creator')
              .populate({
                path: 'children',
                populate: {
                  path: 'creator', 
                  model: 'User' 
                }
              })
              .populate('community')
        ).reverse();

        res.render('community', {
            title: `${community.name}`,
            user: req.session.user,
            community: community,
            posts: posts,
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

        if (!community) {
            return res.render('404');
          }

        const result = await Community.deleteOne({ _id: community._id });

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
router.post('/:name', upload.single('cover'), async (req, res) => {
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
        
        if (!req.file) { community.image = community.image; } else { community.image = req.file ? req.file.filename : null; }

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
    
