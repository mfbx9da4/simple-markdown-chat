var express = require('express');
var http = require('http');
var app = express();
var server = require('http').createServer(app);
var jade = require('jade');
var io = require('socket.io').listen(server);


app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set("view options", {
	layout: false
});
app.configure(function() {
	app.use(express.static(__dirname));
});

app.get('/', function(req, res) {
	var host;
	if (app.settings.env === "development") {
		host = "http://localhost";
	} else {
		host = "http://simple-markdown-chat.herokuapp.com/";
	}
	console.log(app.settings.env);
	res.render('index', {host:host});
});

server.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function(socket) {
	socket.on('message', function(data) {
		io.sockets.emit('message', {
			id: socket.id,
			name: data.name,
			message: data.message
		});
	});
});