import * as TelegramBot from 'node-telegram-bot-api';
import {clone, some} from 'lodash';
import {CONFIG} from '../config';
import {storageSrv} from './storage';
import {BotCallbacks} from './bot-callback';
import {Main} from '../inline-keyboard/main';
import {formsSrv} from './forms';

// unicode of !! emoji, web version has another code
// if (msg.text.match(/\u203C\uFE0F|\u203c/i)) {

class AutoAnswerBot {
  public bot;
  private botCallbacks;
  private formsSrv = formsSrv;
  private storageSrv = storageSrv;

  constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.bot = new TelegramBot(CONFIG.BOT_TOKEN, {polling: true});
    } else {
      this.bot = new TelegramBot(CONFIG.BOT_TOKEN);
      this.bot.setWebHook(process.env.HEROKU_URL + 'bot');
    }

    this.bot.on('inline_query', (msg) => {
      if (msg.query) {
        this.bot.answerInlineQuery(msg.id, [
          {
            type: 'article',
            id: 'article',
            title: 'Send formatted text with disabled web page preview',
            input_message_content: {message_text: msg.query, parse_mode: 'Markdown', disable_web_page_preview: true}
          }
        ]);
      }
    });

    this.bot.on('message', (msg) => {
      let answered = false;
      let isCommand = false;
      console.log('new:', msg);

      if (msg.text) {

        // HELP
        if (msg.text === '/help' || msg.text === '/start') {
          const main = new Main();

          this.bot.sendMessage(msg.chat.id, main.$answer(), {reply_markup: main.$inlineKeyboard()});
          this.track(msg, msg.text);
          answered = true;
          isCommand = true;
        }

        if (msg.text === '/mem') {
          this.bot.sendMessage(msg.chat.id, `${process.memoryUsage().heapTotal / 1048576} Mb`);

          answered = true;
          isCommand = true;
        }

        this.storageSrv.getAnswers().forEach((item) => {
          if (some(item.patterns, (pattern) => pattern === msg.text.toLowerCase())) {
            switch (item.type) {
            case 'gif':
              this.sendGif(msg, item.text, item.name);
              answered = true;
              break;
            case 'text':
              this.sendText(msg, item.text, item.name);
              break;
            case 'photo':
              this.sendPhoto(msg, item.text, item.name);
              break;
            case 'sticker':
              this.sendSticker(msg, item.text, item.name);
              break;
            default:
              this.bot.sendMessage(msg.chat.id, 'Unknown type!');
            }
          }
        });

        if (!answered) {
          this.track(msg, 'text');
        }
      }

      if (!isCommand) {
        this.formsSrv.getForms().forEach((item) => {
          if (msg.chat.id === item.chatId) {
            const validate = item.validate(msg);

            if (validate) {
              this.bot.sendMessage(msg.chat.id, validate);
            } else {
              this.bot.sendMessage(msg.chat.id, item.keyboard.$answer(), {
                reply_markup: item.keyboard.$inlineKeyboard()
              });
              this.formsSrv.unRegister(item);
            }
          }
        });
      }
    });
    this.botCallbacks = new BotCallbacks(this.bot);

    // console.log(this.bot._events);
  }

  public processUpdate(body) {
    this.bot.processUpdate(body);
  }

  private track(msg, command) {
    const message = clone(msg);
    // do not save message text to appmetrica
    message.text = message.text.length;
  }

  private sendText(msg, text, command) {
    this.bot.sendMessage(msg.chat.id, text, {reply_to_message_id: msg.message_id});
    this.track(msg, command);
  }

  private sendSticker(msg, sticker, command) {
    this.bot.sendSticker(msg.chat.id, sticker, {reply_to_message_id: msg.message_id});
    this.track(msg, command);
  }

  private sendGif(msg, gifId, command) {
    this.bot.sendDocument(msg.chat.id, gifId, {reply_to_message_id: msg.message_id});
    this.track(msg, command);
  }

  private sendPhoto(msg, photoId, command) {
    this.bot.sendPhoto(msg.chat.id, photoId, {reply_to_message_id: msg.message_id});
    this.track(msg, command);
  }
}

export const bot = new AutoAnswerBot();
