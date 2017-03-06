import * as TelegramBot from 'node-telegram-bot-api';
import * as Botanio from 'botanio';
import {clone} from 'lodash';

export class BroBot {
  public bot;
  private botan;

  constructor(CONF) {
    if (process.env.NODE_ENV === 'development') {
      this.bot = new TelegramBot(CONF.BOT_TOKEN, {polling: true});
    } else {
      this.bot = new TelegramBot(CONF.BOT_TOKEN);
      this.bot.setWebHook(process.env.HEROKU_URL + 'bot');
    }

    this.botan = new Botanio(CONF.BOTANIO);

    this.bot.on('message', (msg) => {
      console.log('new', msg);

      if (msg.text) {

        let message = clone(msg);
        // do not save message text to appmetrica
        message.text = message.text.length;
        this.botan.track(message, 'text');

        // unicode of !! emoji, web version has another code
        if (msg.text.match(/\u203C\uFE0F|\u203c/i)) {
          return this.sendGif(msg, 'ntts0sjEqNaRG', 'sarcasm');
        }

        if (this.checkForMatch(msg.text, ['миша', 'мишка', 'darmy', 'misha'])) {
          return this.sendGif(msg, 'SWCKeoosjekyQ', 'миша');
        }

        if (this.checkForMatch(msg.text, ['bro', 'бро'])) {
          return this.sendGif(msg, 'Tv2btKgK06tPy', 'бро');
        }

        if (this.checkForMatch(msg.text, ['ахаха'])) {
          return this.sendGif(msg, 'tqf2j43xoEcow', 'ахаха');
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

  sendGif(msg, gifId, command) {
    this.bot.sendVideo(msg.chat.id, `http://i.giphy.com/${gifId}.gif`, {reply_to_message_id: msg.message_id});
    msg.text = msg.text.length;
    this.botan.track(msg, command);
  }

  sendMessage(id, text) {
    this.bot.sendMessage(id, text);
    this.botan.track({
      from: {
        id: 'apimsg'
      }
    }, 'custom apimsg');
  }
}
