const express = require('express');
const multer = require('multer');
const path = require('path');
const Community = require('../models/community');
const User = require('../models/user');
const Post = require('../models/post');
const { mongooseToObj, multipleMongooseToObj } = require('../models/db');
const community = require('../models/community');
const comment = require('../models/comment');
const isAuthenticated = require('./authMiddleware');

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
router.post('/:name', isAuthenticated, upload.single('attachment'), async (req, res) => {
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

router.put('/:id', isAuthenticated, async (req, res) => {
  // Edit Post

  console.log("Editing post");
  const user = req.session.user;
  const post_id = req.params.id;

  const { title, description } = req.body;

  try {
    const post = await Post.findOne({ _id: post_id })
      .populate('creator')
      .populate({
        path: 'children',
        populate: {
          path: 'creator', 
          model: 'User' 
        }
      })
      .populate('community');

    if (!post) {
      return res.render('404');
    }

    post.title = title;
    post.description = description;

    await post.save();
    res.render('post', {
      title: post.title,
      user: user,
      post: mongooseToObj(post),
      openComment: req.query.openComment === 'true' || false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
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

router.post('/like/:id', isAuthenticated, async (req, res) => {
  const username = req.session.user.username;
  const post_id = req.params.id;

  try {
    res.header('Content-Type', 'application/json');
    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likedIndex = post.likes.indexOf(username);
    if (likedIndex !== -1) {
      post.likes.splice(likedIndex, 1);
    } else {
      post.likes.push(username);
    }

    await post.save();

    const isLiked = likedIndex !== -1;

    res.json({ likeCount: post.likes.length, isLiked });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error liking post' });
  }
});

const commentRouter = require('./comment');
router.use('/:id/comment', commentRouter);

module.exports = router;
