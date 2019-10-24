const express = require('express')
const auth = require('../services/authService')
const { getMovies, createMovie, updateMovie, deleteMovie, deleteAllMovies } = require('../services/movieService')

const router = new express.Router()

router.get('/movies', auth, async (req, res) => {
    const movies = await getMovies(req.user, req.query)
    res.send(movies)
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

router.post('/movies', auth, async (req, res) => {
    try {
        const movie = await createMovie(req.body, req.user)
        res.status(201).send(movie)
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

router.patch('/movies/:id', auth, async (req, res) => {
    try {
        const movie = await updateMovie(req.params.id, req.body, req.user)
        res.send(movie)
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

router.delete('/movies/:id', auth, async (req, res) => {
    try {
        const movie = await deleteMovie(req.params.id, req.user)
        res.send(movie)
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

router.delete('/movies', auth, async (req, res) => {
    try {
        const deletedMovies = await deleteAllMovies(req.user)
        res.send(deletedMovies)
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

module.exports = router