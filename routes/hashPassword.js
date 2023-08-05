// helpers.js
const bcrypt = require('bcrypt.js');

module.exports = {
    hashPassword: async function (password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    },
    comparePassword: async function (password1, password2) {
        const comparePassword = await bcrypt.compare(password1, password2);
        return comparePassword;
    }
};
