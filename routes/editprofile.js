const express = require('express');
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const { hashPassword } = require('./hashPassword');

const router = express.Router();

const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../public/assets/profpics'));
        },
        filename: (req, file, cb) => {
            cb(null, req.session.user._id);
        }
    }),
};

router
    .route('/')
    // Goto edit profile page
    .get((req, res) => {
        const user = req.session.user;
    
        if (user) {
            res.render('editprofile', {
                title: 'Animo Edit Profile',
                user: user,
                currentUserUsername: user.username // Pass the current user's username
            });
        } else {
            res.redirect('/login');
        }
    })
    // Update current user
    .post(
        multer(multerConfig).single('profilePicture'),
        async (req, res) => {
            const { username, email, newPassword, confirmNewPassword, id_num, college, course } = req.body;
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
    
                if (username.trim() !== '') {
                    user.username = username;
                }
                user.email = email;
    
                if (newPassword || confirmNewPassword) {
                    if (newPassword !== confirmNewPassword) {
                        return res.render('editprofile', {
                            title: 'Animo Edit Profile',
                            user: req.session.user,
                            error: 'New passwords do not match'
                        });
                    }
                    user.password = await hashPassword(newPassword);
                }
    
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
        }
    )
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