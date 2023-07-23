const express = require('express');
const Community = require('../models/community');
const User = require('../models/user');

const router = express.Router();

router.engine('handlebars', exphbs());
router.set('view engine', 'handlebars');

router.get('/community', (req, res) => {
  res.render('community', data);
});

router.listen(3000, () => {
  console.log('Server started on port 3000');
});
