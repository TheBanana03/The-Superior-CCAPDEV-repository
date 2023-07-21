const express = require('express');
const User = require('../models/user');

const router = express.Router();

router
    .route('/')
    // Goto edit profile page
    .get((req, res) => {
        const user = req.session.user;
        //console.log(req);

        res.render('editprofile', {
            title: 'Animo Edit Profile',
            user: user
        });
    })
    // Update current user
    .put(async (req, res) => {

        const { username, email, password, id_num, college, course } = req.body;
        const userId = req.session.user._id;
      
        try {
            const user = await User.findById(userId);
      
            if (!user) {
                return res.render('editprofile', {
                    title: 'Animo Edit Profile',
                    user: req.session.user,
                    error: 'User not found'
                });
            }
      
            user.username = username;
            user.email = email;
            user.password = password;
            if (college === "") { user.college = undefined } else { user.college = college; }
            if (course === "") { user.course = undefined } else { user.course = course; }
            if (id_num === "") { user.id_num = undefined } else { user.id_num = id_num; }
      
            await user.save();

            req.session.user = user;
            res.redirect('/user');

        } catch (err) {
            console.error(err);
            res.render('editprofile', {
                title: 'Animo Edit Profile',
                user: req.session.user,
                error: 'Error updating user\n' + err
            });
        }
    })
    // Delete current user
    .delete((req, res) => {
        console.log("Delete user request received");
        const userId = req.session.user._id;
        req.session.destroy(async err => {
            if (err) {
                return res.redirect('/');
            }
            
            const result = await User.deleteOne({ _id: userId });

            if (result.deletedCount == 0) {
                return res.render('editprofile', {
                    title: 'Animo Edit Profile',
                    user: req.session.user,
                    error: 'Error deleting user'
                });
            }

            res.clearCookie('sid');
            res.redirect('/login');
        });
    });

module.exports = router;