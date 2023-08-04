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
    attachment: {
        type: String,
        required: false,
    },
    likes: [{
        type: String,
    }],
    children: [{
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
    },
    lastEdited: {
        type: Date,
        required: false
    }
});

postSchema.path('title').validate(function (value) {
    return value.trim().length > 0 && value.trim().length <= 25;
}, 'Invalid post title. It must be between 1 and 25 characters.');

postSchema.path('description').validate(function (value) {
    return value.trim().length > 0 && value.trim().length <= 255;
}, 'Invalid content. It must be between 1 and 255 characters.');


module.exports = mongoose.model('Post', postSchema);