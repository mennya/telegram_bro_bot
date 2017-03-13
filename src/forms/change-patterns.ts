import {storageSrv} from '../services/storage';
import {ChangePatternsEnd} from '../inline-keyboard/change-patterns-end';
import {isArray, isString} from 'lodash';

export class ChangePatternsForm {
  private answer;
  private patterns: [string];
  public chatId;
  public keyboard = new ChangePatternsEnd();

  constructor(msg) {
    this.chatId = msg.chat.id;
  }

  public validate(msg) {
    let err;
    this.answer = storageSrv.getAnswerByName(storageSrv.getSessionData().name);

    try {
      this.patterns = JSON.parse(msg.text);
    } catch (e) {
      err = e;
    }

    if (err || !isArray(this.patterns)) {
      return 'Not a JSON array!';
    }
    this.patterns.forEach((item, i) => {
      if (!item || !isString(item)) {
        err = true;
      }
      this.patterns[i] = item.toLowerCase();
    });
    if (err) {
      return 'Only strings inside array';
    }
    this.answer.patterns = this.patterns;
    storageSrv.editAnswerByName(this.answer);
  }
}
