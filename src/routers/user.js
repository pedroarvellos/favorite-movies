const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const errors = require('../errors/errorTypes')
const { ValidationError, DatabaseError } = require('../errors/errors')

const router = new express.Router()

router.post('/users/signup', async (req, res) => {
    try {
        await User.checkIfUsernameExists(req.body.username)
        const user = new User(req.body)
        try {
            await user.save()
        } catch {
            throw new DatabaseError(errors.DATABASE_USER_CREATION_FAILED)
        }

        const token = await user.generateAuthToken()
        res.status(201).send({ user: user.getMainFields(), token })
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
})

router.post('/users/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findByCredentials(username, password)
        const token = await user.generateAuthToken()

        res.send({ user: user.getMainFields(), token })
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            token != req.token
        })

        try {
            await req.user.save()
        } catch {
            throw new DatabaseError(errors.DATABASE_USER_UPDATE_FAILED)
        }

        res.send()
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'username', 'password']

    const isValid = updates.every(item => allowedUpdates.includes(item))

    try {
        if (!isValid) throw new ValidationError(errors.INVALID_UPDATE_PARAMETERS)

        updates.forEach((item) => req.user[item] = req.body[item])

        try {
            var userUpdated = await req.user.save()
        } catch {
            throw new DatabaseError(errors.DATABASE_USER_UPDATE_FAILED)
        }

        res.send(userUpdated.getMainFields())
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new ValidationError(errors.INVALID_IMAGE_TYPE))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
        req.user.avatar = buffer

        try {
            await req.user.save()
        } catch {
            throw new DatabaseError(errors.DATABASE_USER_UPDATE_FAILED)
        }

        res.send()
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        try {
            await req.user.save()
        } catch {
            throw new DatabaseError(errors.DATABASE_USER_UPDATE_FAILED)
        }
        res.send()
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

module.exports = router