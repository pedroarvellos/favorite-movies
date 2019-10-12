const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/favorite-movies', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})