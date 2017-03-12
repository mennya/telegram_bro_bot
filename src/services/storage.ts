import {remove, findIndex, cloneDeep} from 'lodash';
import {answersModel} from '../models/answers';

interface IAnswers {
  patterns?: [string];
  text?;
  type?;
  name;
}

class StorageService {
  private chatId;
  private answersList: [IAnswers] = [
    {patterns: ['миша', 'мишка', 'darmy', 'misha'], text: 'CgADBAADhAQAAg0aZAewgLgkqS3_qwI', type: 'gif', name: 'Миша'},
    {patterns: ['‼️'], text: 'CgADBAADzxUAAvkZZAdp_PlEJi5-KwI', type: 'gif', name: 'sarcasm'},
    {patterns: ['ахаха'], text: 'CgADBAADSCgAAlsdZAcx-3FXQ6RIZwI', type: 'gif', name: 'ахаха'},
    {patterns: ['text_test'], text: 'text_test passed', type: 'text', name: 'text_test'},
    {patterns: ['sticker_test'], text: 'CAADBQADXwEAAukKyAOSo-65_GBH4AI', type: 'sticker', name: 'sticker_test'},
    {patterns: ['👍'], text: 'CgADBAADZgcAAs4bZAdx4-IPO9SMtgI', type: 'gif', name: 'thumbsup'},
    {patterns: ['bro', 'бро'], text: 'CgADBAADSQgAAqcZZAdrBr4UYDAlUwI', type: 'gif', name: 'bro'}
  ];
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
