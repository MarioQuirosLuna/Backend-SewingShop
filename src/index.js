require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')

const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const productsRouter = require('./controllers/product')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())

app.get('/', (req ,res) => {
	res.send('Hello ')
})

app.use('/api/products', productsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`)
})