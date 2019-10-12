const express = require('express')
const mongoose = require('mongoose')
const User = require('../models/user')

const router = new express.Router()

router.post('/users/signup', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.findByCredentials(username, password)
        const token = await user.generateAuthToken()

        res.send({ user: user, token })
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router