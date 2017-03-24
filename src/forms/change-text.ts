import {storageSrv} from '../services/storage';
import {ChangeTextEnd} from '../inline-keyboard/change-text-end';
import {IForm} from './form';
import {subscription} from '../services/subscribtion';

export class ChangeTextForm implements IForm {
  public chatId;
  public keyboard = new ChangeTextEnd();

  private answer;

  constructor(msg) {
    this.chatId = msg.chat.id;
  }

  public validate(msg) {
    this.answer = storageSrv.getAnswerByName(storageSrv.getSessionData().name);
    const oldText = this.answer.text;

    if (!this.answer.type) {
      return `Oops, you need to set auto answer type first!`;
    }

    if (this.answer.type === 'text') {
      this.answer.text = msg.text;
    } else if (this.answer.type === 'gif' && msg.document) {
      this.answer.text = msg.document.file_id;
    } else if (this.answer.type === 'sticker' && msg.sticker) {
      this.answer.text = msg.sticker.file_id;
    } else if (this.answer.type === 'photo' && msg.photo) {
      this.answer.text = msg.photo[1].file_id;
    } else {
      return `Seems like you send me something wrong :(\nPlease send a ${this.answer.type}.`;
    }

    storageSrv.editAnswerByName(this.answer);
    subscription.notify(`changed text in *${this.answer.name}* from *${oldText}* to`, this.answer.text);
  }
}
