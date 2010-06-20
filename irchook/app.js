var port = 8009;

var sys = require('sys'),
	http = require('http'),
	irc = require('../lib/ircat'),
	config = require('./config'),
	Mustache = require('../lib/mustache');


function GitHub() {
}
GitHub.prototype.generateAction = function (payload) {
	var message = Mustache.to_html(
		'{{author}} pushed "{{ message }}" to {{ repo }}: {{ url }}',
		{
			'repo': payload.repository.name,
			'author': payload.commits[0].author.name,
			'message': payload.commits[0].message,
			'url': payload.commits[0].url});
	return {"action": "messageChannel", "channel": "bloop", "message": message};
};


var bot = irc.create(config.config, function () {
	sys.puts("Connected to IRC");
});

bot.run();


http.createServer(function (req, res) {
	req.addListener('data', function (chunk) {
		var payload = (new GitHub).generateAction(JSON.parse(chunk.toString()));

		bot.emit('joinChannel', {"channel": "bloop"});
		bot.emit(payload.action, payload);

		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write('Thank-you');
		res.end();
	});
}).listen(port);

sys.puts('Server running at http://127.0.0.1:' + port + '/');
