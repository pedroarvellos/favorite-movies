const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('movies', {
    ref: 'Movie',
    localField: '_id',
    foreignField: 'owner'
})

module.exports = mongoose.model('User', userSchema)