import {InlineKeyboard} from './inline-keyboard';
import {storageSrv} from '../services/storage';

export class ChangeType {
  private name;

  constructor() {
    this.name = storageSrv.getSessionData().name;
  }

  public $inlineKeyboard() {
    const inlineKeyboard = new InlineKeyboard();

    inlineKeyboard
      .addButton({text: 'gif', callback_data: 'ChangeTypeEnd gif'})
      .addButton({text: 'text', callback_data: 'ChangeTypeEnd text'})
      .addButton({text: 'sticker', callback_data: 'ChangeTypeEnd sticker'})
      .newLine()
      .addButton({text: `Back to ${this.name}`, callback_data: `Back Edit ${this.name}`});

    return inlineKeyboard.toString();
  }

  public $answer() {
    return `Choose new type for "${this.name}".`;
  }
}
