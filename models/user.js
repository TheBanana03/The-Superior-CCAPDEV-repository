const mongoose = require('mongoose');
const Community = require('./community');
const Post = require('./post');

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
                return value >= 0 && value <= 123;
            },
            message: 'User ID is only until 123'
            },
        validate: {
            validator: function(value) {
                return Number.isInteger(value) && value.toString().length === 3;
            },
            message: 'User ID must be a 3-digit number'
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
        max: 16
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

userSchema.pre('deleteOne', async function (next) {
  
    try {
        const userId = this.getFilter()["_id"];
        const communities = await Community.find({ creator: userId });
  
        await Post.deleteMany({ creator: userId });

        for (const community of communities) {
            await community.deleteOne();
        }

        next();
    } catch (err) {
      next(err); 
    }
});

module.exports = mongoose.model('User', userSchema);
