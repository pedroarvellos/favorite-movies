const mongoose = require('mongoose')
const Movie = require('../models/movieSchema')
const errors = require('../errors/errorTypes')
const { ValidationError, DatabaseError } = require('../errors/errors')

const getMovies = async (mongooseUser, queryParms) => {
    const sort = {}

    if (queryParms.orderBy) {
        const parts = queryParms.orderBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await mongooseUser.populate({
            path: 'movies',
            options: {
                limit: parseInt(queryParms.limit),
                skip: parseInt(queryParms.offset),
                sort
            }
        }).execPopulate()
    } catch {
        throw new DatabaseError(errors.DATABASE_MOVIE_SEARCH_FAILED)
    }

    return mongooseUser.movies
}

const createMovie = async (movie, mongooseUser) => {
    const mongooseMovie = new Movie({
        ...movie,
        owner: mongooseUser._id
    })

    try {
        await mongooseMovie.save()
    } catch {
        throw new DatabaseError(errors.DATABASE_MOVIE_CREATION_FAILED)
    }

    return mongooseMovie
}

const updateMovie = async (_id, movieRequest, mongooseUser) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ValidationError(errors.INVALID_ID)

    const updates = Object.keys(movieRequest)
    const allowedUpdates = ['name']
    const isValidOperation = updates.every(item => allowedUpdates.includes(item))

    if (!isValidOperation) throw new ValidationError(errors.INVALID_UPDATE_PARAMETERS)

    const movie = await Movie.findOne({ _id, owner: mongooseUser._id })

    if (!movie) throw new ValidationError(errors.NOT_EXISTING_MOVIE)

    updates.forEach(item => movie[item] = movieRequest[item])

    try {
        await movie.save()
    } catch {
        throw new DatabaseError(errors.DATABASE_MOVIE_UPDATE_FAILED)
    }

    return movie
}

const deleteMovie = async (_id, mongooseUser) => {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ValidationError(errors.INVALID_ID)

    try {
        var movie = await Movie.findOneAndDelete({ _id, owner: mongooseUser._id })
    } catch {
        throw new DatabaseError(errors.DATABASE_MOVIE_DELETION_FAILED)
    }

    if (!movie) throw new DatabaseError(errors.DATABASE_MOVIE_DELETION_FAILED)

    return movie
}

const deleteAllMovies = async (mongooseUser) => {
    try {
        var movies = await Movie.deleteMany({ owner: mongooseUser._id })
    } catch {
        throw new DatabaseError(errors.DATABASE_MOVIE_DELETION_FAILED)
    }

    if (!movies) throw new DatabaseError(errors.DATABASE_MOVIE_DELETION_FAILED)

    return {
        deletedMovies: movies.deletedCount
    }
}

module.exports = {
    getMovies,
    createMovie,
    updateMovie,
    deleteMovie,
    deleteAllMovies
}