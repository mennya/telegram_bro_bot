import {Edit} from '../inline-keyboard/edit';
import {Delete} from '../inline-keyboard/delete';
import {List} from '../inline-keyboard/list';
import {Main} from '../inline-keyboard/main';
import {Add} from '../inline-keyboard/add';
import {formsSrv} from './forms';
import {AddForm} from '../forms/add';
import {ChangeType} from '../inline-keyboard/change-type';
import {storageSrv} from '../services/storage';
import {ChangeTypeEnd} from '../inline-keyboard/change-type-end';
import {ChangeText} from '../inline-keyboard/change-text';
import {ChangeTextForm} from '../forms/change-text';
import {ChangeNameForm} from '../forms/change-name';
import {ChangeName} from '../inline-keyboard/change-name';
import {CONFIG} from '../config';
import {ChangePatterns} from '../inline-keyboard/change-patterns';
import {ChangePatternsForm} from '../forms/change-patterns';

export class BotCallbacks {
  private ADMINS = CONFIG.ADMINS.split(',');
  private isAdmAction = false;

  constructor(bot) {
    bot.on('callback_query', (callbackQuery) => {
      const action = callbackQuery.data.split(' ');
      const msg = callbackQuery.message;
      let keyboard;
      const opts = {
        chat_id: msg.chat.id,
        message_id: msg.message_id
      };

      if (action[0] === 'Back') {
        action[0] = action[1];
        action[1] = action[2];
      }

      storageSrv.setSession(msg.chat.id);

      switch (action[0]) {
        case 'Edit':
          keyboard = new Edit(action);
          break;
        case 'Delete':
          if (this.isAdmin(callbackQuery.from.id)) {
            keyboard = new Delete();
          }
          break;
        case 'List':
          keyboard = new List();
          break;
        case 'Main':
          keyboard = new Main();
          break;
        case 'Add':
          if (this.isAdmin(callbackQuery.from.id)) {
            keyboard = new Add();
            // form register here because of msg variable
            formsSrv.register(new AddForm(msg));
          }
          break;
        case 'ChangePatterns':
          if (this.isAdmin(callbackQuery.from.id)) {
            keyboard = new ChangePatterns();
            formsSrv.register(new ChangePatternsForm(msg));
          }
          break;
        case 'ChangeType':
          if (this.isAdmin(callbackQuery.from.id)) {
            keyboard = new ChangeType();
          }
          break;
        case 'ChangeTypeEnd':
          keyboard = new ChangeTypeEnd(action);
          break;
        case 'ChangeText':
          if (this.isAdmin(callbackQuery.from.id)) {
            keyboard = new ChangeText();
            formsSrv.register(new ChangeTextForm(msg));
          }
          break;
        case 'ChangeName':
          if (this.isAdmin(callbackQuery.from.id)) {
            keyboard = new ChangeName();
            formsSrv.register(new ChangeNameForm(msg));
          }
          break;
        default:
          console.error('Oooops no action');
      }

      if (this.isAdmAction && !this.isAdmin(callbackQuery.from.id)) {
        bot.editMessageText('Sorry, Only admins can change!', opts);
        this.isAdmAction = false;
      } else {
        opts['reply_markup'] = keyboard.$inlineKeyboard();
        bot.editMessageText(keyboard.$answer(), opts);
      }
    });
  }

  private isAdmin(userId) {
    this.isAdmAction = true;

    return this.ADMINS.includes(userId.toString());
  }
}
