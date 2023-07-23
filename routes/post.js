const express = require('express');
const Community = require('../models/community');
const User = require('../models/user');
const Post = require('../models/post');
const { mongooseToObj, multipleMongooseToObj } = require('../models/db');
const community = require('../models/community');

const router = express.Router();

//Go to Home Page 
router.get('/', (req, res) => {
    res.render('404');
});

//Go to Post Page
router.get('/:id', async (req, res) => {
    const user = req.session.user;
    const post_id = req.params.id;

    try {
        const post = mongooseToObj(await Post.findOne({ _id: post_id }).populate('creator').populate('community'));

        if (!post) {
            return res.render('404');
        }

        res.render('post', {
            title: post.title,
            user: user,
            post: post
        });

    } catch(err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//Create Post
router.post('/:name', async (req, res) => {
    const user = req.session.user;
    const community_name = req.params.name;

    const { title, description } = req.body;

    try {
        const community = mongooseToObj(await Community.findOne({ name: community_name }));

        if (!community) {
            return res.render('404');
        }
        
        const post = new Post({
            title: title,
            description: description,
            creator: user._id,
            community: community._id
        });

        await post.save();
        res.redirect('/community/' + community_name);

    } catch (err) {
        console.error(err);

        const createPost = new Post({
            title: title,
            description: description
        });

        const community = mongooseToObj(await Community.findOne({ name: community_name }));

        res.render('community' + community_name, {
            title: community_name,
            user: user,
            community: community,
            post: createPost,
            error: 'Error creating post\n' + err
        });
    }
});

router.put('/:id', async (req, res) => {
    //Edit Post
    const user = req.session.user;
    const post_id = req.params.id;

    const { title, description } = req.body;

    try {
        const post = mongooseToObj(await Post.findOne({ _id: post_id }));

        if (!post) {
            return res.render('404');
        }

        post.title = title;
        post.description = description;

        await post.save();
        res.redirect('/post/' + post_id);

    } catch (err) {
        //TODO
    }
});

module.exports = router;