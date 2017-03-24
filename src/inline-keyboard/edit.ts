import {InlineKeyboard} from './inline-keyboard';
import {storageSrv} from '../services/storage';

export class Edit {
  private name;
  private answer;

  constructor(action) {
    this.name = action[1];
    this.answer = storageSrv.getAnswerByName(this.name);
    storageSrv.saveSessionData({name: this.name});
  }

  public $inlineKeyboard() {
    const inlineKeyboard = new InlineKeyboard();

    inlineKeyboard
      .addButton({text: '➖Delete ⚠️', callback_data: `Delete`})
      .addButton({text: 'Change text', callback_data: `ChangeText`})
      .newLine()
      .addButton({text: 'Change name', callback_data: `ChangeName`})
      .addButton({text: 'Change type', callback_data: `ChangeType`})
      .newLine()
      .addButton({text: 'Modify patterns', callback_data: `ChangePatterns`})
      .newLine()
      .addButton({text: '🔙Back to list', callback_data: 'Back List'});

    return inlineKeyboard.toString();
  }

  public $answer() {
    return `Editing "${this.name}" ...\n\nName: ${this.answer.name}\nType: ${this.answer.type}\n` +
      `Text: ${this.answer.text}\nPatterns: ${JSON.stringify(this.answer.patterns)}`;
  }
}
