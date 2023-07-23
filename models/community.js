const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        caseSensitive: false
    },
    //Image
    image: {
        type: String,
        required: false,
    },
    tagline: {
        type: String,
        required: true,
        max: 30
    },
    description: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Community', communitySchema);