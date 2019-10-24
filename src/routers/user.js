const express = require('express')
const multer = require('multer')
const auth = require('../middleware/auth')
const errors = require('../errors/errorTypes')
const { createUser, connectUser, disconnectUser, updateUser, updateUserAvatar, deleteUserAvatar } = require('../services/user')
const { ValidationError } = require('../errors/errors')

const router = new express.Router()

router.post('/users/signup', async (req, res) => {
    try {
        const userResponse = await createUser(req.body)
        res.status(201).send(userResponse)
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const userResponse = await connectUser(req.body)
        res.send(userResponse)
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        await disconnectUser(req.user, req.token)
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
    try {
        const userUpdated = await updateUser(req.body, req.user)
        res.send(userUpdated)
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
        await updateUserAvatar(req.file, req.user)
        res.send()
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        await deleteUserAvatar(req.user)
        res.send()
    } catch ({ status, responseError }) {
        responseError !== null && res.status(status).send({ responseError })
    }
}, ({ status, responseError }, req, res, next) => {
    responseError !== null && res.status(status).send({ responseError })
})

module.exports = router