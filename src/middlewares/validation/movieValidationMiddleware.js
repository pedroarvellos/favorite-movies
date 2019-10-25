const errors = require('../../errors/movieErrorTypes')
const { ValidationError } = require('../../errors/errors')

const movieValidationMiddleware = () => {
    return (req, res, next) => {
        const user = req.body
        if (user.name.length > 25) throw new ValidationError(errors.MOVIE_VALIDATION_MAX_NAME_SIZE_EXCEEDED)
        if (user.name === '' || user.name.trim() === '') throw new ValidationError(errors.MOVIE_VALIDATION_NAME_EMPTY)
        next()
    }
}

module.exports = { movieValidationMiddleware }