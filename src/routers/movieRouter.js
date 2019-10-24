const express = require('express')
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const Movie = require('../models/movieSchema')
const errors = require('../errors/errorTypes')
const { ValidationError, DatabaseError } = require('../errors/errors')

const router = new express.Router()

router.get('/movies', auth, async (req, res) => {
    const sort = {}

    if (req.query.orderBy) {
        const parts = req.query.orderBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    await req.user.populate({
        path: 'movies',
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.offset),
            sort
        }
    }).execPopulate()

    res.send(req.user.movies)
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

router.post('/movies', auth, async (req, res) => {
    try {
        const movie = new Movie({
            ...req.body,
            owner: req.user._id
        })

        try {
            await movie.save()
        } catch {
            throw new DatabaseError(errors.DATABASE_USER_CREATION_FAILED)
        }

        res.status(201).send(movie)
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

router.patch('/movies/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(_id)) throw new ValidationError(errors.INVALID_ID)

        const updates = Object.keys(req.body)
        const allowedUpdates = ['name']
        const isValidOperation = updates.every(item => allowedUpdates.includes(item))

        if (!isValidOperation) throw new ValidationError(errors.INVALID_UPDATE_PARAMETERS)

        const movie = await Movie.findOne({ _id, owner: req.user._id })

        if (!movie) throw new ValidationError(errors.NOT_EXISTING_MOVIE)

        updates.forEach(item => movie[item] = req.body[item])

        try {
            await movie.save()
        } catch {
            throw new DatabaseError(errors.DATABASE_MOVIE_UPDATE_FAILED)
        }

        res.send(movie)
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

router.delete('/movies/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(_id)) throw new ValidationError(errors.INVALID_ID)

        try {
            var movie = await Movie.findOneAndDelete({ _id, owner: req.user._id })

            if (!movie) throw new DatabaseError(errors.DATABASE_MOVIE_DELETION_FAILED)
        } catch ({ status, responseError }) {
            responseError !== null && res.status(status).send({ responseError })
        }

        res.send(movie)
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

router.delete('/movies', auth, async (req, res) => {
    try {
        var movies = await Movie.deleteMany({ owner: req.user._id })

        if (!movies) throw new DatabaseError(errors.DATABASE_MOVIE_DELETION_FAILED)
        res.send({
            deletedMovies: movies.deletedCount
        })
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

module.exports = router