var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(app){

	// Set .html as the default template extension
	app.set('view engine', 'html');
        //support parsing of application/json type post data
        app.use(bodyParser.json());
        //support parsing of application/x-www-form-urlencoded post data
        app.use(bodyParser.urlencoded({ extended: true })); 
	// Initialize the ejs template engine
	app.engine('html', require('ejs').renderFile);

	// Tell express where it can find the templates
	app.set('views', __dirname + '/views');

	// Make the files in the public folder available to the world
	app.use(express.static(__dirname + '/public'));

};
