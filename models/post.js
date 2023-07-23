const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 1,
        max: 25,
        unique: false,
        caseSensitive: false
    },
    description: {
        type: String,
        min: 1,
        max: 255,
        required: true
    },
    //Image
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    postDate: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Post', postSchema);