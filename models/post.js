const mongoose = require('mongoose');
const Comment = require('./comment');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 1,
        unique: false,
        caseSensitive: false
    },
    description: {
        type: String,
        min: 1,
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

postSchema.pre('deleteOne', async function (next) {
    try {
        const post = await this.model.findOne(this.getFilter());
        const commentIds = post.children;
        if (commentIds && commentIds.length > 0) {
            await Comment.deleteMany({ _id: { $in: commentIds } });
        }
        next();
    } catch(err) {
        next(err);
    }
});

postSchema.pre('deleteMany', async function (next) {
    const postsToDelete = await this.model.find(this.getFilter());
    const commentIds = postsToDelete.reduce((acc, post) => {
        return acc.concat(post.children);
    }, []);
    if (commentIds && commentIds.length > 0) {
        try {
            await Comment.deleteMany({ _id: { $in: commentIds } });
        } catch (err) {
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model('Post', postSchema);