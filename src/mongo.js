const mongoose = require('mongoose')

const connectionString = process.env.MONGODB_URI

//connection to mongodb

mongoose.connect(connectionString, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => console.log('Database connected'))
	.catch(err => console.error(err))

process.on('uncaughtException', (error) => {
	console.log(error)
	mongoose.disconnect()
})

