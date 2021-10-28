const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/User')

userRouter.post('/', async (req, res) => {
	const { body } = req
	const { username, password } = body

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)
	const newUser = new User({
		username,
		passwordHash,
	})

	const savedUser = await newUser.save()

	res.status(201).json(savedUser)
})

module.exports = userRouter