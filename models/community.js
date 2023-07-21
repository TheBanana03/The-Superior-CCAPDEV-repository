const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
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
    tags: [{
        color: String,
        name: String,
    }]
});

module.exports = mongoose.model('Community', communitySchema);