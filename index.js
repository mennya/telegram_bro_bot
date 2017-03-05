const express    = require('express');
const bodyParser = require('body-parser');
const CONF = require('./src/config');
const app        = express();
const bot        = new (require('./src/bot'))(CONF);
app.use(bodyParser.json());

const server = app.listen(CONF.PORT, '0.0.0.0', () => {
	const host = server.address().address;
	const port = server.address().port;
	console.log('Web server started at http://%s:%s', host, port);
});

app.post('/bot', function(req, res) {
	bot.processUpdate(req.body);
	res.sendStatus(200);
});

app.get('/bot', (req, res) => {
	let text = req.query.sendText;

	if (!text) {
		return res.send(`The "sendText" parameter should be provided. Message not sent!`);
	}

	bot.bot.sendMessage(CONF.BRO_GROUP_ID, req.query.sendText);

	res.send(`OK! The message "${req.query.sendText}" has been sent to Bro Group.`);
});
