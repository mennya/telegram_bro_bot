import {InlineKeyboard} from './inline-keyboard';
import {storageSrv} from '../services/storage';
import {subscription} from '../services/subscribtion';

export class Delete {
  private name;

  constructor() {
    this.name = storageSrv.getSessionData().name;
    storageSrv.delAnswerByName(this.name);
    subscription.notify('delete', this.name);
  }

  public $inlineKeyboard() {
    const inlineKeyboard = new InlineKeyboard();

    inlineKeyboard
      .addButton({text: 'Back to list', callback_data: 'Back List'});

    return inlineKeyboard.toString();
  }

  public $answer() {
    return `"${this.name}" auto answer successfully deleted!`;
  }
}
