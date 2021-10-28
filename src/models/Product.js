const {model, Schema} = require('mongoose')

const productSchema = new Schema({
	nameProduct: String,
	price: Number,
	url: String
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