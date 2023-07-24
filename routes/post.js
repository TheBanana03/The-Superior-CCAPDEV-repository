const express = require('express');
const multer = require('multer');
const path = require('path');
const Community = require('../models/community');
const User = require('../models/user');
const Post = require('../models/post');
const { mongooseToObj, multipleMongooseToObj } = require('../models/db');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/assets/postpics/')); // Specify the directory where the uploaded files will be saved.
  },
    filename: (req, file, cb) => {
        cb(null, Date.now() + req.session.user._id);
    }
});

const upload = multer({ storage: storage });

// Go to Home Page
router.get('/', (req, res) => {
  res.render('404');
});

// Go to Post Page
router.get('/:id', async (req, res) => {
  const user = req.session.user;
  const post_id = req.params.id;

    try {
        const post = mongooseToObj(
            await Post.findOne({ _id: post_id }).populate('creator').populate('community')
        );

        if (!post) {
            console.log("Post not found!: " + post_id + "\n");
            return res.render('404');
        }

        res.render('post', {
            title: post.title,
            user: user,
            post: post,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

//Edit Post
router.put('/:id', async (req, res) => {
    const user = req.session.user;
    const post_id = req.params.id;

    const { title, description } = req.body;

    try {
        const post = await Post.findOne({ _id: post_id });

        if (!post) {
            console.log("Editing Post not found!: " + post_id + "\n");
            return res.render('404');
        }

        post.title = title;
        post.description = description;
        post.lastEdited = Date.now();

        await post.save();
        res.redirect('/post/' + post_id);
    } catch (err) {
        res.render('post', {
            title: newPost.title,
            user: user,
            post: { _id: post_id, title, description },
            error: 'Error editing post\n' + err,
        });
    }
});

//Delete Community
router.delete('/:id', async (req, res) => {
    const post_id = req.params.id;
    const user = req.session.user;

    const { title, description } = req.body;
    console.log(title + description);

    try {
        const result = await Post.deleteOne({ _id: post_id });

        if (result.deletedCount == 0) {
            return res.render('post', {
                title: title,
                user: req.session.user,
                post: { _id: post_id, title, description },
                error: 'Error deleting Post'
            });
        }

        return res.render('user', {
            title: req.session.user.username + '\'s Profile',
            user: req.session.user,
            viewUser: req.session.user
        });

    } catch(err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Create Post
router.post('/:name', upload.single('attachment'), async (req, res) => {
  const user = req.session.user;
  const community_name = req.params.name;

  const { title, description } = req.body;

  try {
    const community = mongooseToObj(await Community.findOne({ name: community_name }));

    if (!community) {
        console.log("Community not found when making post!: " + community_name + "\n");
        return res.render('404');
    }

    const post = new Post({
      title: title,
      description: description,
      creator: user._id,
      community: community._id,
      attachment: req.file ? req.file.filename : null, // Save the filename of the uploaded image if present, otherwise null.
    });

    await post.save();
    res.redirect('/community/' + community_name);
  } catch (err) {
    console.error(err);
    const community = mongooseToObj(await Community.findOne({ name: community_name }));

    res.render('community' + community_name, {
      title: community_name,
      user: user,
      community: community,
      post: { _id: post_id, title, description },
      error: 'Error creating post\n' + err,
    });
  }
});

module.exports = router;
