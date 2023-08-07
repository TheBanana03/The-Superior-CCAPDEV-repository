const express = require('express');
const User = require('../models/user');
const { comparePassword } = require('./hashPassword');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', {
    title: 'Animo Login'
  });
});

router.post('/', async (req, res) => {
  const { username, password, remember } = req.body;
  console.log(username, password, remember);

  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.render('login', {
        title: 'Animo Login',
        error: 'User not found'
      });
    }

    const checkPass = await comparePassword(password, user.password);
    if (!checkPass) {
      return res.render('login', {
        title: 'Animo Login',
        error: 'Incorrect Password'
      });
    }

    req.session.user = user;
    req.session.authenticated = true;

    if (remember) {
        const maxAgeInMilliseconds = 1000 * 60 * 60 * 24 * 7 * 3; // 3 weeks
        req.session.cookie.maxAge = maxAgeInMilliseconds;
    } else {
        req.session.cookie.expires = false;
        req.session.cookie.maxAge = 1000 * 60 * 60 * 7; // 7 hours
    }

    res.redirect('/');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).render('error', {
      title: 'Animo Error',
      error: 'Internal Server Error'
    });
  }
});

module.exports = router;