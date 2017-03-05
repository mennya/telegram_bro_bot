const TelegramBot = require('node-telegram-bot-api');

module.exports = class {
  constructor(CONF) {
    if (process.env.NODE_ENV === 'development') {
      this.bot = new TelegramBot(CONF.BOT_TOKEN, {polling: true});
    } else {
      this.bot = new TelegramBot(CONF.BOT_TOKEN);
      this.bot.setWebHook(process.env.HEROKU_URL + 'bot');
    }

    this.bot.on('message', (msg) => {
      console.log('new', msg);

      if (msg.text) {
        if (msg.text.match(/‼️/i)) {
          this.sendGif(msg, 'ntts0sjEqNaRG');
        }

        if (this.checkForMatch(msg.text, ['миша', 'мишка', 'darmy', 'misha'])) {
          this.sendGif(msg, 'SWCKeoosjekyQ');
        }

        if (this.checkForMatch(msg.text, ['bro', 'бро'])) {
          this.sendGif(msg, 'Tv2btKgK06tPy');
        }

        if (this.checkForMatch(msg.text, ['ахаха'])) {
          this.sendGif(msg, 'tqf2j43xoEcow');
        }
      }
    });
  }

  checkForMatch(string, array) {
    const str = string.toLowerCase();
    for (let i = 0; i < array.length; i++) {
      if (str === array[i] || new RegExp('(?:^|\\s)' + array[i] + '(?:\\?|\\!|$|\\s)', 'gi').test(str)) {
        return true;
      }
    }
  }

  sendGif(msg, gifId) {
    this.bot.sendVideo(msg.chat.id, `http://i.giphy.com/${gifId}.gif`, {reply_to_message_id: msg.message_id});
  }
};
