const errors = require('../../errors/userErrorTypes')
const { ValidationError } = require('../../errors/errors')

const userValidationMiddleware = () => {
    return (req, res, next) => {
        const user = req.body
        if (user.username.length > 25) throw new ValidationError(errors.USER_VALIDATION_MAX_USERNAME_SIZE_EXCEEDED)
        if (user.username === '' || user.username.trim() === '') throw new ValidationError(errors.USER_VALIDATION_USERNAME_EMPTY)
        if (user.name.length > 50) throw new ValidationError(errors.USER_VALIDATION_MAX_NAME_SIZE_EXCEEDED)
        if (user.name.trim === '' || user.name.trim() === '') throw new ValidationError(errors.USER_VALIDATION_NAME_EMPTY)
        if (user.password.length > 50) throw new ValidationError(errors.USER_VALIDATION_MAX_PASSWORD_SIZE_EXCEEDED)
        if (user.password.trim === '' || user.password.trim() === '') throw new ValidationError(errors.USER_VALIDATION_PASSWORD_EMPTY)
        next()
    }
}

module.exports = { userValidationMiddleware }