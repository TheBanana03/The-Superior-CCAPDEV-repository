const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    content: {
        type: String,
        min: 1,
        max: 255,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('Comment', commentSchema);
