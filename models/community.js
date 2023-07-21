const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        caseSensitive: false
    },
    //Image
    tagline: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    follower_count: {
        type: Number,
        default: 0,
        required: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Community', communitySchema);