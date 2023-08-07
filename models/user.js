const mongoose = require('mongoose');
const Community = require('./community');
const Post = require('./post');
const Comment = require('./comment');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 16,
        unique: true,
        lowercase: true,
        caseSensitive: false
    },
    //Image
    email: {
        type: String,
        required: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    id_num: {
        type: Number,
        required: false,
        validate: {
            validator: function(value) {
                return Number.isInteger(value) && value >= 0 && value <= 123;
            },
            message: 'User ID must be a number between 0 and 123'
        }
    },
    college: {
        type: String,
        required: false,
        enum: ['bagced', 'ccs', 'tdsol', 'cla', 'cos', 'gcoe', 'cob', 'soe']
    },
    course: {
        type: String,
        required: false,
        maxlength: 16
    },
    followed_communities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],
    profilePicturePath: {
        type: String,
        required: false,
    },
});

userSchema.path('username').validate(function (value) {
    return value.trim().length >= 3 && value.trim().length <= 16;
}, 'Invalid username. It must be between 3 and 16 characters.');

userSchema.path('password').validate(function (value) {
    return value.trim().length >= 6;
}, 'Invalid password. It must greater than 6 characters.');

userSchema.pre('deleteOne', async function (next) {
  
    try {
        const userId = this.getFilter()["_id"];
        const communities = await Community.find({ creator: userId });
  
        await Post.deleteMany({ creator: userId });
        await Comment.deleteMany({ creator: userId })

        for (const community of communities) {
            await community.deleteOne();
        }

        next();
    } catch (err) {
      next(err); 
    }
});

module.exports = mongoose.model('User', userSchema);
