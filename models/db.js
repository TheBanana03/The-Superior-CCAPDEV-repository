const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect(process.env.DATABASE_URL)
    const db = mongoose.connection;

    db.on('error', error => console.error(error));
    db.once('open', () => console.log('Connected to Mongoose'));

    return db;
}

const multipleMongooseToObj = (arrayOfMongooseDocuments) => {
    const tempArray = [];
    if (arrayOfMongooseDocuments.length !== 0){
      arrayOfMongooseDocuments.forEach(doc => tempArray.push(doc.toObject()));
    }
    return tempArray;
};
  
const mongooseToObj = (doc) => { if (doc == null){ return null; } return doc.toObject(); };
  
module.exports = {
    connect,
    mongooseToObj,
    multipleMongooseToObj
};