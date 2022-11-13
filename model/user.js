const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
var uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password']
    },
    rpassword: {
        type: String,
        required: [true, 'Please provide a password']
    }
});

userSchema.pre('save', function(next){
    const user = this

    bcrypt.hash(user.password, 10, (error, hash)=>{
        user.password = hash
        next()
    })
})
userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema )

module.exports = User