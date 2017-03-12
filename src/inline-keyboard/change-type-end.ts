import {InlineKeyboard} from './inline-keyboard';
import {storageSrv} from '../services/storage';

export class ChangeTypeEnd {
  private name;
  private type;
  private answer;

  constructor(action) {
    this.type = action[1];
    this.name = storageSrv.getSessionData().name;
    this.answer = storageSrv.getAnswerByName(this.name);
    this.answer.type = this.type;
    storageSrv.editAnswerByName(this.answer);
  }

  public $inlineKeyboard() {
    const inlineKeyboard = new InlineKeyboard();

    inlineKeyboard
      .addButton({text: `Back to "${this.name}"`, callback_data: `Back Edit ${this.name}`});

    return inlineKeyboard.toString();
  }

  public $answer() {
    return `Success! "${this.name}" auto answer type changed to ${this.type}.`;
  }
}
