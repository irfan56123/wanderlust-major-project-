const { required } = require("joi");
const mongoose = require("mongoose");
const passport = require("passport");
const Schema = mongoose.Schema;
const passportLoalMongoose =  require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }

    // passport-local-mongoose automatally implemented username, hashhing password and salting and also some method
});

userSchema.plugin(passportLoalMongoose);

module.exports = mongoose.model('User',userSchema);