const moviePrefix = 'MV-'

module.exports = {
    MOVIE_DATABASE_CREATION_FAILED: {
        code: moviePrefix + 1001,
        message: 'Fail to create movie.',
        httpStatus: 400
    },
    MOVIE_DATABASE_UPDATE_FAILED: {
        code: moviePrefix + 1002,
        message: 'Fail to update movie.',
        httpStatus: 400
    },
    MOVIE_DATABASE_DELETION_FAILED: {
        code: moviePrefix + 1003,
        message: 'Fail to delete movie(s).',
        httpStatus: 400
    },
    MOVIE_DATABASE_SEARCH_FAILED: {
        code: moviePrefix + 1004,
        message: 'Fail to search for movies.',
        httpStatus: 400
    },
    MOVIE_VALIDATION_INVALID_UPDATE_PARAMETERS: {
        code: moviePrefix + 1005,
        message: 'Please, insert valid parameters to update movie.',
        httpStatus: 400
    },
    MOVIE_VALIDATION_INVALID_ID: {
        code: moviePrefix + 1006,
        message: 'Please, enter a valid ID.',
        httpStatus: 400
    },
    MOVIE_VALIDATION_NOT_EXISTING_MOVIE: {
        code: moviePrefix + 1007,
        message: 'Please, enter an existing movie.',
        httpStatus: 400
    },
    MOVIE_VALIDATION_NAME_EMPTY: {
        code: moviePrefix + 1008,
        message: 'Please, make sure the name field is not empty',
        httpStatus: 400
    },
    MOVIE_VALIDATION_MAX_NAME_SIZE_EXCEEDED: {
        code: moviePrefix + 1009,
        message: 'Please, make sure the name does not exceed 50 characters',
        httpStatus: 400
    }
}