const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        err.message !== null ? res.status(400).send({error: err.message}) : res.status(400)
    }
})

router.post('/users/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findByCredentials(username, password)
        const token = await user.generateAuthToken()

        res.send({ user: user, token })
    } catch (err) {
        err.message !== null ? res.status(400).send({error: err.message}) : res.status(400)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            token != req.token
        })

        await req.user.save()

        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'username', 'password']

    const isValid = updates.every(item => allowedUpdates.includes(item))

    if (!isValid) res.status(400).send({ error: 'Invalid updates!' })

    try {
        updates.forEach((item) => req.user[item] = req.body[item])

        await req.user.save()

        res.send(req.user)
    } catch (err) {
        res.status(400).send(e)
    }
})

module.exports = router