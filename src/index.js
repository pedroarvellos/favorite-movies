const express = require('express')
const userRouter = require('./routers/userRouter')
const movieRouter = require('./routers/movieRouter')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(movieRouter)
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

