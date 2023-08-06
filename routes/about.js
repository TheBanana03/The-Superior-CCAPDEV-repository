const express = require('express');
const router = express.Router();
const { multipleMongooseToObj } = require('../models/db');
const Community = require('../models/community');

router.get("/", async (req, res) => {
    const user = req.session.user;
    const communities = multipleMongooseToObj(await Community.find({}));

    res.render("about", {
        title: "About Us",
        user: user,
        communities: communities
    });
});

module.exports = router;
