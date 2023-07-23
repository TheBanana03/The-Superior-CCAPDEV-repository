const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Define the route for the search form (GET request)
router.get('/', (req, res) => {
  res.render('search_form', { title: 'Search Posts' });
});

// Define the route for handling the search form submission (POST request)
router.post('/', async (req, res) => {
  const searchText = req.body.searchText;

  // Perform the search query on the "posts" collection in the "test" database
  try {
      const searchResults = await Post.find({
          $or: [
              { name: { $regex: searchText, $options: 'i' } }, // Case-insensitive search on "name" field
              { description: { $regex: searchText, $options: 'i' } }, // Case-insensitive search on "description" field
          ],
      });

      res.render('search_results', {
          title: 'Search Results',
          results: searchResults,
      });
  } catch (err) {
      console.error('Error while searching for posts:', err);
      res.status(500).render('500', { title: 'Internal Server Error' });
  }
});

module.exports = router;
