const userRouter = require('express').Router()
const User = require('../models/User')

userRouter.post('/', async (req, res) => {
	const { body } = req
	const { username, password } = body
	console.log(body)
	const user = new User({
		username: username,
		passwordHash: password
	})

	const savedUser = await user.save()

	res.json(savedUser)
})

module.exports = userRouter