const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
// const Community = require('../models/community');
const { mongooseToObj, multipleMongooseToObj } = require('../models/db');

const router = express.Router();

async function findAllPostsForUser(userId) {
    try {
        const userPostedPosts = await Post.find({ creator: userId }).exec();

        const userComments = await Comment.find({ creator: userId }).exec();
        const commentPostIds = userComments.map(comment => comment.post);

        const userCommentedPosts = await Post.find({ _id: { $in: commentPostIds } }).exec();

        const allPosts = [...userPostedPosts, ...userCommentedPosts].filter((post, index, self) =>
            index === self.findIndex(p => p._id.equals(post._id))
        );

        return allPosts;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    else {

        const posts = multipleMongooseToObj(await findAllPostsForUser(req.session.user._id));

        // const posts = await Post.find({ poster: req.session.user._id }).exec();
        // console.log(posts);

        try {
            res.render('user', {
                title: req.session.user.username + '\'s Profile',
                user: req.session.user,
                viewUser: req.session.user,
                posts: posts
            });
        } catch(err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
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

        const posts = multipleMongooseToObj(await findAllPostsForUser(viewUser._id));
        

        // const posts = await Post.find({ poster: viewUser._id }).exec();
        // console.log(posts);

        res.render('user', {
            title: `${username}'s Profile`,
            user: req.session.user,
            viewUser: viewUser,
            posts: posts
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;