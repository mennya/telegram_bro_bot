const express     = require('express');
const bodyParser  = require('body-parser');
const app         = express();
const TelegramBot = require('node-telegram-bot-api');
const CONF        = process.env;
const PORT        = CONF.PORT || 5000;

app.use(bodyParser.json());

const server = app.listen(PORT, "0.0.0.0", function() {
	const host = server.address().address;
	const port = server.address().port;
	console.log('Web server started at http://%s:%s', host, port);
});

app.post('/bot', function(req, res) {
	bot.processUpdate(req.body);
	res.sendStatus(200);
});

const bot = new TelegramBot(CONF.TOKEN);
bot.setWebHook(process.env.HEROKU_URL + 'bot');

bot.on('message', (msg) => {
	const chatId = msg.chat.id;

	console.log('new', msg);

	if (msg.text.match(/‼️/i)) {
		bot.sendVideo(chatId, 'http://i.giphy.com/ntts0sjEqNaRG.gif');
	}

	if (msg.text.match(/миша|мишка|darmy|misha/i)) {
		bot.sendVideo(chatId, 'http://i.giphy.com/SWCKeoosjekyQ.gif');
	}

	if (msg.text.match(/бро|bro/i)) {
		bot.sendVideo(chatId, 'http://i.giphy.com/Tv2btKgK06tPy.gif');
	}

	if (msg.text.match(/ахаха/i)) {
		bot.sendVideo(chatId, 'http://i.giphy.com/tqf2j43xoEcow.gif');
	}
});
