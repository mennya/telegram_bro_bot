import {storageSrv} from '../services/storage';
import {remove} from 'lodash';
import {ChangeNameEnd} from '../inline-keyboard/change-name-end';
import {IForm} from './form';
import {subscription} from '../services/subscribtion';

export class ChangeNameForm implements IForm {
  public chatId;
  public keyboard = new ChangeNameEnd();

  private answers = [];
  private answer;
  private name;

  constructor(msg) {
    this.chatId = msg.chat.id;
  }

  public validate(msg) {
    if (storageSrv.getAnswers().length > 28) {
      return `Sorry, auto answers count can't be bigger than 28 :(`;
    }
    if (msg.text.length > 10) {
      return 'Should be less than 10 symbols!';
    }
    if (msg.text.indexOf(' ') >= 0) {
      return 'No spaces!';
    }
    if (!new RegExp('[A-Za-zа-яА-Я]+').test(msg.text)) {
      return 'Only Latin and Cyrillic alphabet!';
    }
    this.answers = storageSrv.getAnswers();
    this.name = storageSrv.getSessionData().name;
    remove(this.answers, (item) => item.name === this.name);
    if (this.answers.some((item) => item.name === msg.text)) {
      return `Such name already exists!`;
    }

    this.answer = storageSrv.getAnswerByName(this.name);
    storageSrv.delAnswerByName(this.name);
    this.answer.name = msg.text;
    storageSrv.newAnswer(msg.text);
    storageSrv.editAnswerByName(this.answer);
    subscription.notify(`changed name from *${this.name}* to`, msg.text);
  }
}
