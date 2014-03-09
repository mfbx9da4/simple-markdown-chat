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

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  app.set('host', "http://localhost");
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
  app.set('host', "http://simple-markdown-chat.herokuapp.com/");
});

app.get('/', function(req, res) {
	res.render('index', {host: app.get('host')});
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