// import our dependencies
const
	fs = require('fs'),
	path = require('path'),
	express = require('express'),
	multer = require('multer');

// a helper funcion to log server activity to the console with timestamps
function log(message) {
	const timestamp = new Date()
		.toISOString()
		.substr(0, 19);
	console.log(`${timestamp} ${message}`);
}

// set the port that the express web server will listen on
const port = 8080;

// set the upload directory
const uploadDir = 'client/uploads';

// configure multer to handle file uploads
const upload = multer({
	storage: multer.diskStorage({
		destination: uploadDir,
		filename: function (req, file, nameFile) {
			nameFile(null, `recording-${Date.now()}.webm`);
		}
	})
});

// configure the express server
express()
	// log every request
	.use((req, res, next) => {
		log(`[${req.method}] ${req.path}`);
		next();
	})
	// use the static middleware to serve the client application files from the client folder
	.use(express.static('client'))
	// use the json middleware to parse the json values sent from the client application
	.use(express.json())
	// list uploaded files using the node file system function
	.get('/list', (req, res) => {
		log('Listing uploaded files...');
		fs.readdir(uploadDir, (err, files) => {
			// return the list of files as a json object
			res.json(files);
		});
	})
	// handle the file upload using multe
	.post('/upload', upload.single('recording'), (req, res) => {
		log('Received audio file');
		res.end();
	})
	// start the server
	.listen(port, () => {
		log(`listening on port ${port}`)
	});