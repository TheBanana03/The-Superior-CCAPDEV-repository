const mongoose = require('mongoose');
const Post = require('./post');

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