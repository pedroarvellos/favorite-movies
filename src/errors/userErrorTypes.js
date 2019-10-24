const userPrefix = 'US-'

module.exports = {
    USER_DATABASE_CREATION_FAILED: {
        code: userPrefix + 1001,
        message: 'Fail to create user.',
        httpStatus: 401
    },
    USER_DATABASE_UPDATE_FAILED: {
        code: userPrefix + 1002,
        message: 'Fail to update user.',
        httpStatus: 401
    },
    USER_DATABASE_SEARCH_FAILED: {
        code: userPrefix + 1003,
        message: 'Fail to find user.',
        httpStatus: 401
    },
    USER_VALIDATION_LOGIN_INVALID: {
        code: userPrefix + 1004,
        message: 'Unable to login. Please, check your e-mail and/or password.',
        httpStatus: 400
    },
    USER_VALIDATION_TOKEN_FAILED: {
        code: userPrefix + 1005,
        message: 'Token validation failed.',
        httpStatus: 401
    },
    USER_VALIDATION_INVALID_UPDATE_PARAMETERS: {
        code: userPrefix + 1006,
        message: 'Please, insert valid parameters to update user.',
        httpStatus: 400
    },
    USER_VALIDATION_INVALID_IMAGE_TYPE: {
        code: userPrefix + 1007,
        message: 'Please, upload a valid image.',
        httpStatus: 400
    },
    USER_VALIDATION_INVALID_USERNAME: {
        code: userPrefix + 1008,
        message: 'Please, enter a new username.',
        httpStatus: 400
    }
}