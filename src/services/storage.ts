import {remove, findIndex, cloneDeep} from 'lodash';
import {answersModel} from '../models/answers';

export interface IAnswers {
  patterns?: [string];
  text?;
  type?;
  name;
}

class StorageService {
  private chatId;
  private answersList: [IAnswers];
  private session = {};

  constructor() {
    answersModel.find().exec((err, res: [IAnswers]) => {
      this.answersList = res;
    });
  }

  public setSession(chatId) {
    this.chatId = chatId;
    if (this.session[chatId]) {
      this.session[chatId].date = new Date();
    } else {
      this.session[chatId] = {date: new Date()};
    }
  }

  public saveSessionData(data) {
    this.session[this.chatId].data = data;
  }

  public getSessionData() {
    return cloneDeep(this.session[this.chatId].data);
  }

  public newAnswer(name: string) {
    const newAnswer = new answersModel({name});
    newAnswer.save();
    this.answersList.push({name});
  }

  public editAnswerByName(pattern) {
    answersModel.update({name: pattern.name}, pattern, (err) => console.error(err));
    this.answersList[findIndex(this.answersList, (item) => item.name === pattern.name)] = pattern;
  }

  public delAnswerByName(name) {
    answersModel.remove({name}, (err) => console.error(err));
    remove(this.answersList, (item) => item.name === name);
  }

  public getAnswerByName(name) {
    return cloneDeep(this.answersList[findIndex(this.answersList, (item) => item.name === name)]);
  }

  public getAnswers() {
    return cloneDeep(this.answersList);
  }
}

export const storageSrv = new StorageService();
