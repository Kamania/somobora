var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(app,io){

	// Set .html as the default template extension
	app.set('view engine', 'html');
        //support parsing of application/json type post data
        app.use(bodyParser.json());
        
        //support parsing of application/x-www-form-urlencoded post data
        app.use(bodyParser.urlencoded({ extended: true })); 
        
	// Make the files in the public folder available to the world
	app.use(express.static(__dirname + '/public'));

};
