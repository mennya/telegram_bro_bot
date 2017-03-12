import {remove} from 'lodash';

class FormsService {
  private formsList = [];

  public register(form) {
    this.formsList.push(form);
  }

  public unRegister(form) {
    remove(this.formsList, (item) => item.chatId === form.chatId);
  }

  public getForms() {
    return this.formsList;
  }
}

export const formsSrv = new FormsService();
