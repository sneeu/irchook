var port = 8009;

// Requries http://github.com/danwrong/restler
var sys = require('sys'),
	http = require('http'),
	fs = require('fs'),
	irc = require('./ircat'),
	Mustache = require('./mustache')
	;


http.createServer(function (req, res) {
	if (req.method != 'POST') {
		res.writeHead(200, {'Content-Type': 'text/plain'});

		var templateName = 'form.html';

		fs.readFile('./templates/' + templateName, function (err, templateContents) {
			if (err) {
				sys.puts(err);
			} else {
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(Mustache.to_html(templateContents.toString()));
				res.end();
			}
		});
	}

	req.addListener('data', function (chunk) {
		sys.puts(chunk);
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write('OK');
		res.end();
	});

}).listen(port);

sys.puts('Server running at http://127.0.0.1:' + port + '/');
