const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        max: 255,
        // required: true
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        delete: 'no cascade'
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    postDate: {
        type: Date,
        default: Date.now,
    },
    lastEdited: {
        type: Date,
        required: false
    }
});

module.exports = mongoose.model('Comment', commentSchema);
