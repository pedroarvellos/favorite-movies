const statusCode = require('http')

module.exports = {
    LOGIN_INVALID: {
        code: 10001,
        message: 'Unable to login. Please, check your e-mail and/or password.',
        httpStatus: 400
    },
    TOKEN_VALIDATION_FAILED: {
        code: 10002,
        message: 'Token validation failed.',
        httpStatus: 401
    },
    DATABASE_USER_CREATION_FAILED: {
        code: 10003,
        message: 'Fail to create user.',
        httpStatus: 401
    },
    DATABASE_USER_UPDATE_FAILED: {
        code: 10003,
        message: 'Fail to update user.',
        httpStatus: 401
    },
    INVALID_UPDATE_PARAMETERS: {
        code: 10004,
        message: 'Invalid parameters.',
        httpStatus: 400
    },
    INVALID_IMAGE_TYPE: {
        code: 10005,
        message: 'Please, upload a valid image.',
        httpStatus: 400
    },
    INVALID_USERNAME: {
        code: 10006,
        message: 'Please, enter a new username.',
        httpStatus: 400
    }
}