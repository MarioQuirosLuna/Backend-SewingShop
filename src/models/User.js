const {model, Schema} = require('mongoose')

const userSchema = new Schema({
	username: String,
	passwordHash: String,
	role: String
})

userSchema.set('toJSON', {
	transform:(document, returnedObject) => {
		returnedObject.id = returnedObject._id
		delete returnedObject._id
		delete returnedObject.__v

		delete returnedObject.passwordHash
	}
})

const User = model('User', userSchema)

module.exports = User