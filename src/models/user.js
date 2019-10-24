const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const errors = require('../errors/errorTypes')
const { ValidationError, DatabaseError } = require('../errors/errors')

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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('movies', {
    ref: 'Movie',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.getMainFields = function () {
    return {
        _id: this._id,
        name: this.name,
        username: this.username,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        __v: this.__v,
    };
}

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 8)
    next()
})

userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, 'LF2ZGKuhPsGE439YybE3')

    this.tokens = this.tokens.concat({ token })

    try {
        await this.save()
    } catch {
        throw new DatabaseError(errors.DATABASE_USER_UPDATE_FAILED)
    }

    return token
}

userSchema.statics.findByCredentials = async (username, password) => {
    try {
        var user = await User.findOne({ username })
    } catch {
        throw new DatabaseError(errors.DATABASE_USER_SEARCH_FAILED)
    }

    if (!user) throw new ValidationError(errors.LOGIN_INVALID)

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) throw new ValidationError(errors.LOGIN_INVALID)

    return user
}

userSchema.statics.checkIfUsernameExists = async (username) => {
    try {
        var user = await User.findOne({ username })
    } catch {
        throw new DatabaseError(errors.DATABASE_USER_SEARCH_FAILED)
    }

    if (user) throw new ValidationError(errors.INVALID_USERNAME)
}

const User = mongoose.model('User', userSchema)

module.exports = User