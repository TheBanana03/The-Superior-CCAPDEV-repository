const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 16,
        unique: false,
        caseSensitive: false
    },
    description: {
        type: String,
        min: 1,
        max: 255,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
});

module.exports = mongoose.model('Post', postSchema);
