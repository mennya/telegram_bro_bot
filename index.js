const TelegramBot = require('node-telegram-bot-api');
const CONF = require('./conf');

const bot = new TelegramBot(CONF.TOKEN, {polling: true});

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
