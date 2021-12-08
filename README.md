# Backend-SewingShop
It is a project that I did for the small sewing business that belongs to my mother, in which I needed to show the products that she made

Deployed in: https://backend-sewingshop.herokuapp.com/api/products

## Clone and run the local project

Download the project

Open the command line

To install the dependencies use in your local repository

	npm install

Create an .env file

Inside 
* Specify the PORT and the connection string MONGODB_URI
* Specify the SECRET for jsonwebtoken
* Specify the CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET for upload images to cloudinary
	
For example
	
	PORT=####
	MONGODB_URI=stringconnection
	SECRET=####
	
	CLOUDINARY_CLOUD_NAME=XXXX
	CLOUDINARY_API_KEY=####
	CLOUDINARY_API_SECRET=XXXX
		
To start it locally

	npm start
	
To start it locally in development mode

	npm run dev
	
## The project should look like this

![Captura de pantalla (5)](https://user-images.githubusercontent.com/37676736/139481385-cd574640-d687-4bd1-ae4d-c0b3b636a0dd.png)

## GetProducts
![Img preview](https://res.cloudinary.com/dusx4zdpz/image/upload/v1638990442/portfolio/portfolio/Codigo_r5ims3.png)


## Frontend

The frontend repository is here: https://github.com/MarioQuirosLuna/Frontend-SewingShop

Deployed in: https://tallerdecosturacintyaluna.vercel.app/
