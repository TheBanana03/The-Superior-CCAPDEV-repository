const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 8
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
        enum: ['bagced', 'ccs', 'tdsol', 'cla', 'cos', 'gcoe', 'cob', 'soe']
    },
    course: {
        type: String,
        max: 50
    }
});

module.exports = mongoose.model('User', userSchema);
