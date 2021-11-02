// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
	console.log(error.name)
	if(error.name === 'CastError'){
		res.status(400).send({error: 'id used is malformed'})
	}else if(error.name === 'JsonWebTokenError'){
		res.status(401).send({error: 'token missing or invalid'})
	}else if(error.name === 'TokenExpiredError'){
		res.status(401).send({error: 'token expired'})
	}else if(error.name === 'MulterError'){
		res.status(400).send({error: error.code})
	}else if(error.name === 'Error'){
		//Error with cloudinary
		res.status(error.http_code).send({error: error.message})
	}else{
		res.status(500).send({error: error.name})
	}
}