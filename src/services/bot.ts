import * as TelegramBot from 'node-telegram-bot-api';
import {forEach, some} from 'lodash';
import {CONFIG} from '../config';
import {storageSrv} from './storage';
import {BotCallbacks} from './bot-callback';
import {Main} from '../inline-keyboard/main';
import {formsSrv} from './forms';
import {IForm} from '../forms/form';
import * as request from 'request';

// unicode of !! emoji, web version has another code
// if (msg.text.match(/\u203C\uFE0F|\u203c/i)) {

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/56.0.2924.87 Safari/537.36';

class AutoAnswerBot {
  public bot;
  private botCallbacks;
  private formsSrv = formsSrv;
  private storageSrv = storageSrv;

  constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.bot = new TelegramBot(CONFIG.BOT_TOKEN, {polling: true, filepath: false});
    } else {
      this.bot = new TelegramBot(CONFIG.BOT_TOKEN, {filepath: false});
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
      let isCommand = false;
      console.log('new:', msg);

      if (msg.text) {

        // HELP
        if (msg.text === '/help' || msg.text === '/start') {
          const main = new Main();

          this.bot.sendMessage(msg.chat.id, main.$answer(), {reply_markup: main.$inlineKeyboard()});
          isCommand = true;
        }

        if (msg.text === '/mem') {
          this.bot.sendMessage(msg.chat.id, `${process.memoryUsage().heapTotal / 1048576} Mb`);

          isCommand = true;
        }

        if (msg.text.match(/vk.com/i)) {
          request({
            url: msg.text, headers: {
              'User-Agent': USER_AGENT
            }
          }, (err, response, body) => {
            const res = body && body.match(/(href=")(\/doc[^\'\"]+)/);
            if (res && res.length) {
              this.bot.sendChatAction(msg.chat.id, 'upload_video');
              this.bot.sendVideo(msg.chat.id, request.get(`https://vk.com${res[2]}&wnd=1&module=wall&mp4=1`),
                {disable_notification: false, reply_to_message_id: msg.message_id})
                .catch((error) => {
                  this.sendErr(`sendText ${error}`);
                });
            }
          });
        }

        this.storageSrv.getAnswers().forEach((item) => {
          if (some(item.patterns, (pattern) => pattern === msg.text.toLowerCase())) {
            switch (item.type) {
            case 'gif':
              this.sendGif(msg, item.text);
              break;
            case 'text':
              this.sendText(msg, item.text);
              break;
            case 'photo':
              this.sendPhoto(msg, item.text);
              break;
            case 'sticker':
              this.sendSticker(msg, item.text);
              break;
            default:
              this.bot.sendMessage(msg.chat.id, 'Unknown type!');
            }
          }
        });
      }

      if (!isCommand) {
        forEach(this.formsSrv.getForms(), (item: IForm) => {
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

    this.bot.on('polling_error', (error) => {
      this.sendErr(`polling_error: ${error}`);
      console.error(error);
    });

    this.bot.on('webhook_error', (error) => {
      this.sendErr(`webhook_error: ${error}`);
      console.error(error);
    });

    this.botCallbacks = new BotCallbacks(this.bot);
  }

  public processUpdate(body) {
    this.bot.processUpdate(body);
  }

  public sendErr(text) {
    if (text) {
      console.error(text);
      this.bot.sendMessage(CONFIG.SUPER_ADMIN, `Err in ${text}`);
    }
  }

  public sendMsg(id, text) {
    this.bot.sendMessage(id, text, {parse_mode: 'Markdown'});
  }

  private sendText(msg, text) {
    this.bot.sendMessage(msg.chat.id, text, {reply_to_message_id: msg.message_id})
      .catch((error) => {
        this.sendErr(`sendText ${error}`);
      });
  }

  private sendSticker(msg, sticker) {
    this.bot.sendSticker(msg.chat.id, sticker, {reply_to_message_id: msg.message_id})
      .catch((error) => {
        this.sendErr(`sendSticker ${error}`);
      });
  }

  private sendGif(msg, gifId) {
    this.bot.sendDocument(msg.chat.id, gifId, {reply_to_message_id: msg.message_id})
      .catch((error) => {
        this.sendErr(`sendGif error: ${error}`);
      });
  }

  private sendPhoto(msg, photoId) {
    this.bot.sendPhoto(msg.chat.id, photoId, {reply_to_message_id: msg.message_id})
      .catch((error) => {
        this.sendErr(`sendPhoto error: ${error}`);
      });
  }
}

export const bot = new AutoAnswerBot();
