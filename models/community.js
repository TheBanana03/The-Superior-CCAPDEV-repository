const mongoose = require('mongoose');
const Post = require('./post');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        caseSensitive: false,
        min: 3,
        max: 24
    },
    //Image
    image: {
        type: String,
        required: false,
    },
    tagline: {
        type: String,
        required: true,
        min: 3,
        max: 32
    },
    description: {
        type: String,
        required: true,
        min: 3,
        max: 256
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

communitySchema.path('name').validate(function (value) {
    return value.trim().length >= 3 && value.trim().length <= 24;
}, 'Invalid community name. It must be between 3 and 24 characters.');

communitySchema.path('tagline').validate(function (value) {
    return value.trim().length >= 3 && value.trim().length <= 32;
}, 'Invalid tagline. It must be between 3 and 32 characters.');

communitySchema.path('description').validate(function (value) {
    return value.trim().length >= 3 && value.trim().length <= 256;
}, 'Invalid description. It must be between 3 and 256 characters.');

communitySchema.pre('deleteOne', async function (next) {
    try {
        const communityId = this.getFilter()["_id"];
        await Post.deleteMany({ community: communityId });

        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Community', communitySchema);