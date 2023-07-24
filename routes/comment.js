const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const { mongooseToObj, multipleMongooseToObj } = require('../models/db');

const router = express.Router({ mergeParams: true });

// Update Comment 
router.put('/:commentid', async (req, res) => {
    const user = req.session.user;
    const post_id = req.params.id;
    const comment_id = req.params.commentid;

    const { comment } = req.body;

    try {
        const updateComment = await Comment.findOne({ _id: comment_id });

        if (!updateComment) {
            console.log("Editing Comment not found!: " + comment_id + "\n");
            return res.render('404');
        }

        updateComment.content = comment;
        updateComment.lastEdited = Date.now();

        await updateComment.save();

        res.redirect('/post/' + post_id);

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Delete Comment
router.delete('/:commentid', async (req, res) => {
    const user = req.session.user;
    const post_id = req.params.id;
    const comment_id = req.params.commentid;

    console.log("Deleting comment with id:", comment_id);

    try {
        const post = await Post.findOneAndUpdate(
            { _id: post_id },
            { $pull: { children: comment_id } },
            { new: true }
        );

        console.log(post);

        if (!post) {
            console.error("Post not found!");
            return res.render('404');
        }

        const result = await Comment.deleteOne({ _id: comment_id });

        if (result.deletedCount == 0) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }

        //res.redirect('/post/' + post_id + '?openComment=true');
        res.render('post', {
            title: post.title,
            user: user,
            post: post,
            openComment: true
        });

    } catch(err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Post Comment
router.post('/', async (req, res) => {
    const user = req.session.user;
    const post_id = req.params.id;
    const { comment } = req.body;

    try {
        const post = await Post.findOne({ _id: post_id }).populate('creator').populate('community').populate('children')

        if (!post) {
            console.log("Failed to find post for comment")
            console.log("Post not found!: " + post_id + "\n");
            return res.render('404');
        }

        const newComment = new Comment({
            content: comment,
            creator: user._id,
            post: post._id,
            children: []
        });

        const savedComment = await newComment.save();

        post.children.push(savedComment._id);
        await post.save();

        res.redirect('/post/' + post_id + '?openComment=true');

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;