const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
	const { body } = req
	const { username, password } = body

	const user = await User.findOne({ username: username })
    
	const passwordCorrect = user === null
		? false
		: await bcrypt.compare(password, user.passwordHash)
        
	if(!(user && passwordCorrect)) {
		res.status(401).json({
			error: 'invalid user or password'
		})
	}

	const userForToken = {
		id: user._id,
		username: user.username,
		role: user.role
	}

	//Expires every day 
	const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 60 * 60 * 24})

	res.send({
		username: user.username,
		token,
		role: user.role
	})
})

module.exports = loginRouter