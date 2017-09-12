var express = require('express'),
app = express();

var address =  process.env.OPENSHIFT_NODEJS_IP || "http://127.0.0.1:8080"; // Listening to localhost if you run locally
var port = process.env.PORT || 8080;

var io = require('socket.io').listen(app.listen(port));//emit address if persist

require('./config')(app);
require('./routes')(app, io,address);


console.log('Soma Bora is running on http://host:' + port +" address "+address);
