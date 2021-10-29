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

productRouter.post('/', userExtractor, upload.single('image'), async (req,res, next) => {
	const { nameProduct, price} = req.body

	if(!nameProduct || !price) {
		return res.status(400).json({ error: 'field is missing' })
	}

	try{
		const result = await cloudinary.uploader.upload(req.file.path)

		let newProduct = new Product({
			nameProduct: nameProduct,
			price: price,
			url: result.secure_url,
			cloudinary_id: result.public_id
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

		await cloudinary.uploader.destroy(product.cloudinary_id)

		await product.remove()

		res.status(204).end()
	}catch(error){
		next(error)
	}
})

/**
 * PUT
 */

productRouter.put('/:id', userExtractor, upload.single('image'), async (req, res, next) => {
	const { id } = req.params
	const { nameProduct, price } = req.body
	
	try{
		let product = await Product.findOne({_id: id})

		await cloudinary.uploader.destroy(product.cloudinary_id)
		
		const result = await cloudinary.uploader.upload(req.file.path)

		let newProductInfo = {
			nameProduct: nameProduct,
			price: price,
			url: result.secure_url,
			cloudinary_id: result.public_id
		}
		console.log(newProductInfo)
		product = await Product.findByIdAndUpdate(id, newProductInfo, {new : true})

		res.json(product)

	}catch(error){
		next(error)
	}

})

module.exports = productRouter