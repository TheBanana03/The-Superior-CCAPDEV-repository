const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    const db = mongoose.connection;

    db.on('error', error => console.error(error));
    db.once('open', () => console.log('Connected to Mongoose'));

    return db;
}

module.exports = connect;