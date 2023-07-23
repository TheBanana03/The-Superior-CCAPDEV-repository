const express = require('express');
const Community = require('../models/community');
const User = require('../models/user');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, '../public/assets/community'));
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "_" + file.originalname);
        }
    }),
};

router.get('/', (req, res) => {
    res.redirect('/');
});

router.post(        
    multer(multerConfig).single('coverPhoto'),
    function (req, res, next) {
        console.log('hi');
        if (!req.file) {
            return res.send('Error uploading the file.');
        }

        const filePath = req.file.path;

        const filename = path.basename(filePath);

        req.session.filename = filename;

        next();
}, 

async (req, res) => {
    const user = req.session.user;
    
    const community = new Community({
        name: req.body.name,
        tagline: req.body.tagline,
        description: req.body.description,
        coverphoto: req.session.filename,
        creator: user._id
    });

    try {
        const newCommunity = await community.save();

        //make get route for /:id
        res.redirect('/');

    } catch (err) {
        console.error(err);
        res.render('createcommunity', {
            title: 'Animo Create Community',
            user: user,
            community: community,
            error: 'Error creating community\n' + err
        });
    }
});

router.get('/create', (req, res) => {
    const user = req.session.user;
    
    res.render('createcommunity', {
        title: 'Animo Create Community',
        user: user
    });
});

module.exports = router;
    
