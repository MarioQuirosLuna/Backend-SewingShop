const productRouter = require('express').Router()
const Product = require('../models/Product')

/**
 * GETs
 */

productRouter.get('/', (req, res) => {
	Product
		.find({})
		.then(products => res.json(products))
})

productRouter.get('/:id', (req, res, next) => {
	const { id }  = req.params
	Product.find({_id: id})
		.then(product => {
			if(product) {
				return res.json(product)
			}else{
				next()
			}
		}).catch(err => next(err))
})

productRouter.get('/name/:nameProduct', (req,res, next) => {
	const { nameProduct }  = req.params
	Product.find({nameProduct: nameProduct})
		.then(product => {
			if(product && product.length !== 0) {
				return res.json(product)
			}else{
				next()
			}
		}).catch(err => next(err))
})

/**
 * POST
 */

productRouter.post('/', (req,res, next) => {
	const product = req.body

	if(!product) {
		return res.status(400).json({
			error: 'product or product.content is missing'
		})
	}

	const newProduct = new Product({
		nameProduct: product.nameProduct,
		price: product.price,
		url: product.url
	})

	newProduct.save()
		.then(savedProduct => res.status(201).json(savedProduct))
		.catch(error => next(error))
})

/**
 * DELETE
 */

productRouter.delete('/:id', (req, res, next) => {
	const { id } = req.params
	Product.findByIdAndDelete(id)
		.then(() => res.status(204).end())
		.catch(error => next(error))
})

/**
 * PUT
 */

productRouter.put('/:id', (req, res, next) => {
	const { id } = req.params
	const product = req.body
	
	const newProductInfo = {
		nameProduct: product.nameProduct,
		price: product.price,
		url: product.url
	}

	Product.findByIdAndUpdate(id, newProductInfo, {new : true})
		.then(result => res.json(result))
		.catch(err => next(err))
})

module.exports = productRouter