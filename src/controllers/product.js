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
	Product.find({nameProduct: {'$regex': nameProduct, '$options': 'i'}})
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
	const { nameProduct, priceInitial, priceFinal} = req.body

	if(!nameProduct || !priceInitial || !priceFinal) {
		return res.status(400).json({ error: 'field is missing' })
	}

	try{

		if(req.files.length <= 0) return res.status(400).send({error: 'field images is empty'})

		let images = await uploadMultiImage(req)

		let newProduct = new Product({
			nameProduct: nameProduct,
			priceInitial: priceInitial,
			priceFinal: priceFinal,
			availability: 'Por pedido',
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

		if(!product) return res.status(404).send({error: 'product not found'})

		deleteMultiImage(product)

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
	const { nameProduct, priceInitial, priceFinal } = req.body
	
	try{
 

		let product = await Product.findOne({_id: id})

		if(!product) return res.status(404).send({error: 'product not found'})

		let images = null
		let newProductInfo = {}

		if(req.files.length < 0){
			images = await uploadMultiImage(req)
			newProductInfo = {
				nameProduct: nameProduct,
				priceInitial: priceInitial,
				priceFinal: priceFinal,
				availability: 'Por pedido',
				images: product.images.concat(images)
			}
		}else{	
			newProductInfo = {
				nameProduct: nameProduct,
				priceInitial: priceInitial,
				priceFinal: priceFinal,
				availability: 'Por pedido',
				images: product.images
			}
		}

		product = await Product.findByIdAndUpdate(id, newProductInfo, {new : true})

		res.json(product)

	}catch(error){
		next(error)
	}

})

const uploadMultiImage = async (req) => {
	
	const promises = req.files.map(async (file) => {
		return await cloudinary.uploader.upload(file.path)
	})
	const resultUpload = await Promise.all(promises)

	let imagesCloudinary = []

	resultUpload.map((img) => {
		return imagesCloudinary.push({
			cloudinary_id: img.public_id,
			url: img.secure_url
		})
	})

	return imagesCloudinary
}

const deleteMultiImage = async (product) => {
	//await cloudinary.uploader.destroy(product.cloudinary_id)
	const promisesDelete = product.images.map(async (image) => {
		return await cloudinary.uploader.destroy(image.cloudinary_id)
	})
	await Promise.all(promisesDelete)
}

module.exports = productRouter