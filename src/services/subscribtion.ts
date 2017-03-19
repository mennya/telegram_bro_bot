import {bot} from './bot';
import {storageSrv} from './storage';
import {ICallbackQuery} from './bot-callback';
import {forEach} from 'lodash';

class Subscription {
  public notify(type, what) {
    const callbackQuery: ICallbackQuery = storageSrv.getSessionData().callbackQuery;
    forEach(storageSrv.getSettings(), (item: any) => {
      const name = callbackQuery.from.username ?
        '@' + callbackQuery.from.username : callbackQuery.from.first_name;
      if (item.userId.toString() !== callbackQuery.from.id.toString()) {
        bot.sendMsg(item.userId, `User ${name} has ${type} *${what}*`);
      }
    });
  }
}

export const subscription = new Subscription();
