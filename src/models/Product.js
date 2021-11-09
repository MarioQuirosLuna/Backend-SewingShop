const {model, Schema} = require('mongoose')

const productSchema = new Schema({
	nameProduct: String,
	priceInitial: Number,
	priceFinal: Number,
	availability: String,
	images: Array
})

productSchema.set('toJSON', {
	transform:(document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v
	}
})

const Product = model('Product', productSchema)

module.exports = Product