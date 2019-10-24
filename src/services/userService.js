const User = require('../models/userShema')
const errors = require('../errors/errorTypes')
const { ValidationError, DatabaseError } = require('../errors/errors')
const sharp = require('sharp')

const createUser = async (userRequest) => {
    await User.checkIfUsernameExists(userRequest.username)
    const user = new User(userRequest)

    try {
        await user.save()
    } catch {
        throw new DatabaseError(errors.DATABASE_USER_CREATION_FAILED)
    }

    const token = await user.generateAuthToken()

    return {
        user: user.getMainFields(),
        token
    }
}

const connectUser = async (userRequest) => {
    const { username, password } = userRequest

    const user = await User.findByCredentials(username, password)
    const token = await user.generateAuthToken()

    return {
        user: user.getMainFields(),
        token
    }
}

const disconnectUser = async (mongooseUser, currentToken) => {
    mongooseUser.tokens = mongooseUser.tokens.filter(token => {
        token != currentToken
    })

    try {
        await mongooseUser.save()
    } catch {
        throw new DatabaseError(errors.DATABASE_USER_UPDATE_FAILED)
    }
}

const updateUser = async (userRequest, mongooseUser) => {
    const updates = Object.keys(userRequest)
    const allowedUpdates = ['name', 'username', 'password']

    const isValid = updates.every(item => allowedUpdates.includes(item))

    if (!isValid) throw new ValidationError(errors.INVALID_UPDATE_PARAMETERS)

    updates.forEach((item) => mongooseUser[item] = userRequest[item])

    try {
        var userUpdated = await mongooseUser.save()
    } catch {
        throw new DatabaseError(errors.DATABASE_USER_UPDATE_FAILED)
    }

    return userUpdated.getMainFields()
}

const updateUserAvatar = async (file, mongooseUser) => {
    const buffer = await sharp(file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    mongooseUser.avatar = buffer

    try {
        await mongooseUser.save()
    } catch {
        throw new DatabaseError(errors.DATABASE_USER_UPDATE_FAILED)
    }
}

const deleteUserAvatar = async (mongooseUser) => {
    mongooseUser.avatar = undefined
    try {
        await mongooseUser.save()
    } catch {
        throw new DatabaseError(errors.DATABASE_USER_UPDATE_FAILED)
    }
}

module.exports = {
    createUser,
    connectUser,
    disconnectUser,
    updateUser,
    updateUserAvatar,
    deleteUserAvatar
}