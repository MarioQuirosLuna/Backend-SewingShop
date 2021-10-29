const productRouter = require('express').Router()
const userExtractor = require('../middleware/userExtractor')
const Product = require('../models/Product')

const cloudinary = require('../utils/cloudinary')
const upload = require('../utils/multer')

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

productRouter.post('/', userExtractor, upload.array('images', 10), async (req,res, next) => {
	const { nameProduct, price} = req.body

	if(!nameProduct || !price) {
		return res.status(400).json({ error: 'field is missing' })
	}

	try{
		//const result = await cloudinary.uploader.upload(req.file.path)
		const promises = req.files.map(async (file) => {
			return await cloudinary.uploader.upload(file.path)
		})

		const result = await Promise.all(promises)

		let images = []

		result.map((img) => {
			return images.push({
				cloudinary_id: img.public_id,
				url: img.secure_url
			})
		})

		let newProduct = new Product({
			nameProduct: nameProduct,
			price: price,
			images: images
		})

		const savedProduct = await newProduct.save()

		res.status(201).json(savedProduct)
	}catch (error) {
		next(error)
	}
})

/**
 * DELETE
 */

productRouter.delete('/:id', userExtractor, async (req, res, next) => {
	const { id } = req.params
	
	try{
		let product = await Product.findOne({_id: id})

		//await cloudinary.uploader.destroy(product.cloudinary_id)
		const promisesDelete = product.images.map(async (image) => {
			return await cloudinary.uploader.destroy(image.cloudinary_id)
		})
		await Promise.all(promisesDelete)

		await product.remove()

		res.status(204).end()
	}catch(error){
		next(error)
	}
})

/**
 * PUT
 */

productRouter.put('/:id', userExtractor, upload.array('images', 10), async (req, res, next) => {
	const { id } = req.params
	const { nameProduct, price } = req.body
	
	try{
		let product = await Product.findOne({_id: id})

		//await cloudinary.uploader.destroy(product.cloudinary_id)
		const promisesDelete = product.images.map(async (image) => {
			return await cloudinary.uploader.destroy(image.cloudinary_id)
		})
		await Promise.all(promisesDelete)

		//const result = await cloudinary.uploader.upload(req.file.path)
		const promisesUpdate = req.files.map(async (file) => {
			return await cloudinary.uploader.upload(file.path)
		})
		const result = await Promise.all(promisesUpdate)

		let images = []

		result.map((img) => {
			return images.push({
				cloudinary_id: img.public_id,
				url: img.secure_url
			})
		})

		let newProductInfo = {
			nameProduct: nameProduct,
			price: price,
			images: images
		}

		product = await Product.findByIdAndUpdate(id, newProductInfo, {new : true})

		res.json(product)

	}catch(error){
		next(error)
	}

})

module.exports = productRouter