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

commentSchema.pre('deleteOne', async function (next) {
    try {
        const comment = await this.model.findOne(this.getFilter());
        const commentIds = post.children;
        if (commentIds && commentIds.length > 0) {
            await this.model.deleteMany({ _id: { $in: commentIds } });
        }
        next();
    } catch(err) {
        next(err);
    }
});

commentSchema.pre('deleteMany', async function (next) {
    const commentsToDelete = await this.model.find(this.getFilter());
    const commentIds = commentsToDelete.reduce((acc, post) => {
        return acc.concat(post.children);
    }, []);
    if (commentIds && commentIds.length > 0) {
        try {
            await this.model.deleteMany({ _id: { $in: commentIds } });
        } catch (err) {
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model('Comment', commentSchema);
