require('dotenv').config()
require('./mongo')

const express = require('express')
const app = express()
const cors = require('cors')
const Product = require('../src/Model/Product')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
app.use(express.json())

app.get('/', (request,response) => {
	response.send('Hello')
})

app.get('/api/products', (request,response) => {
	Product.find({})
		.then(products => response.json(products))
})

app.get('/api/product/:id', (request,response, next) => {
	const { id }  = request.params
	Product.find({_id: id})
		.then(product => {
			if(product) {
				return response.json(product)
			}else{
				next()
			}
		}).catch(err => next(err))
})

app.get('/api/product/name/:nameProduct', (request,response, next) => {
	const { nameProduct }  = request.params
	Product.find({nameProduct: nameProduct})
		.then(product => {
			if(product && product.length !== 0) {
				return response.json(product)
			}else{
				next()
			}
		}).catch(err => next(err))
})

app.delete('/api/products/:id', (request, response, next) => {
	const { id } = request.params
	Product.findByIdAndDelete(id)
		.then(() => response.status(204).end())
		.catch(error => next(error))
})

app.post('/api/product', (request,response, next) => {
	const product = request.body

	if(!product) {
		return response.status(400).json({
			error: 'product or product.content is missing'
		})
	}

	const newProduct = new Product({
		nameProduct: product.nameProduct,
		price: product.price,
		url: product.url
	})

	newProduct.save()
		.then(savedProduct => response.json(savedProduct))
		.catch(error => next(error))

})

app.put('/api/product/:id', (request,response, next) => {
	const { id } = request.params
	const product = request.body
	
	const newProductInfo = {
		nameProduct: product.nameProduct,
		price: product.price,
		url: product.url
	}

	Product.findByIdAndUpdate(id, newProductInfo, {new : true})
		.then(result => response.json(result))
		.catch(err => next(err))
})

app.use(notFound)
app.use(handleErrors)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`)
})