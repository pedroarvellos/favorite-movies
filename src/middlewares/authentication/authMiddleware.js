const jwt = require('jsonwebtoken')
const User = require('../models/userShema')
const errors = require('../errors/userErrorTypes')
const { ValidationError } = require('../errors/errors')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'LF2ZGKuhPsGE439YybE3')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) throw new Error()

        req.token = token
        req.user = user
        next()
    } catch {
        return next(new ValidationError(errors.USER_VALIDATION_TOKEN_FAILED))
    }
}

module.exports = auth