var client = require('./ircat/bot'),
	net = require('net'),
	sys = require('sys'),
	log = sys.puts;


function Ircat() {
	this.setupBot();
	this.setupListener();
};


Ircat.prototype.setupBot = function () {
	var server = this;
	var options = {
		username: 'bloopbot',
		ip: 'irc.imaginarynet.org.uk',
		port: 6667
	};

	this.ircatBot = client.create(options, function () {
		server.connection.listen(8009);
		sys.puts("Connected to IRC");
	});
};


Ircat.prototype.setupListener = function () {
	var bot = this.ircatBot;
	this.connection = net.createServer(function (socket) {
		socket.setEncoding("utf8");

		socket.addListener("connect", function () {
			sys.puts('Connection.');
		});
		socket.addListener("data", function (data) {
			var payload = JSON.parse(data);
			socket.write("Received: " + data);
			bot.emit(payload.action, payload);
			socket.end();
		});
		socket.addListener("end", function () {
			sys.puts('End.');
		});
	});
};


Ircat.prototype.run = function() {
	this.ircatBot.run();
};


(new Ircat()).run();
