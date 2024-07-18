const mongo = require('mongoose');

mongo.connect('mongodb://localhost:27017/testing', {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Schema for my Database (attributes that I'm gonna use)
const UserSchema = new mongo.Schema({
    username: String,
    email: String,
    password: String,
    age: Number
});

module.exports = mongo.model('user', UserSchema);
