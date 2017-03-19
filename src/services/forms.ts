class FormsService {
  private formsList = {};

  public register(form) {
    this.formsList[form.chatId] = form;
  }

  public unRegister(form) {
    delete this.formsList[form.chatId];
  }

  public getForms() {
    return this.formsList;
  }
}

export const formsSrv = new FormsService();
