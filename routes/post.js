const express = require('express');
const multer = require('multer');
const path = require('path');
const Community = require('../models/community');
const User = require('../models/user');
const Post = require('../models/post');
const { mongooseToObj, multipleMongooseToObj } = require('../models/db');
const community = require('../models/community');
const comment = require('../models/comment');

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

router.get('/:id', async (req, res) => {
  const user = req.session.user;
  const post_id = req.params.id;;

  try {
      const post = mongooseToObj(
          await Post.findOne({ _id: post_id })
            .populate('creator')
            .populate({
              path: 'children',
              populate: {
                path: 'creator', 
                model: 'User' 
              }
            })
            .populate('community')
        );

      if (!post) {
          console.log("Post not found!: " + post_id + "\n");
          return res.render('404');
      }

      res.render('post', {
          title: post.title,
          user: user,
          post: post,
          openComment: req.query.openComment === 'true' || false,
          error: decodeURIComponent(req.query.error) || ''
      });
  } catch (err) {
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

    const createPost = new Post({
      title: title,
      description: description,
    });

    const community = mongooseToObj(await Community.findOne({ name: community_name }));

    res.render('community' + community_name, {
      title: community_name,
      user: user,
      community: community,
      post: createPost,
      error: 'Error creating post\n' + err,
    });
  }
});

router.put('/:id', async (req, res) => {
  // Edit Post
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
    // TODO: Handle error
  }
});

router.post('/like/:id', async (req, res) => {
  // Like Post
  const username = req.session.user.username;
  const post_id = req.params.id;

  try {
    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.render('404');
    }

      const likedIndex = post.likes.indexOf(username);
      if (likedIndex !== -1) {
        post.likes.splice(likedIndex, 1); // Unlike the post
      } else {
        post.likes.push(username); // Like the post
      }

    await post.save();
    res.redirect(`/post/${post_id}`);
    
  } catch (err) {
    console.error(err);

    res.render('likepost', {
      title: 'Animo Like Post',
      user: req.session.user,
      error: 'Error liking post\n' + err
    });
  }
});

const commentRouter = require('./comment');
router.use('/:id/comment', commentRouter);

module.exports = router;
