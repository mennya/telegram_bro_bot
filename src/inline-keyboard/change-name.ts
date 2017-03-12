import {InlineKeyboard} from './inline-keyboard';
import {storageSrv} from '../services/storage';

export class ChangeName {
  private name;

  constructor() {
    this.name = storageSrv.getSessionData().name;
  }

  public $inlineKeyboard() {
    const inlineKeyboard = new InlineKeyboard();

    inlineKeyboard
      .newLine()
      .addButton({text: `Back to ${this.name}`, callback_data: `Back Edit ${this.name}`});

    return inlineKeyboard.toString();
  }

  public $answer() {
    return `OK. Send me a new name.`;
  }
}
