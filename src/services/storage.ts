import {cloneDeep, extend, findIndex, isArray, remove} from 'lodash';
import {answersModel} from '../models/answers';
import {settingsModel} from '../models/settings';

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
  private settings = [];

  constructor() {
    answersModel.find().exec((err, res: [IAnswers]) => {
      this.answersList = res;
    });
    settingsModel.find().exec((err, res) => {
      if (!isArray(res)) {
        this.settings = [res];
      } else {
        this.settings = res;
      }
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

  public getSettings() {
    return cloneDeep(this.settings);
  }

  public getUserSettings(userId) {
    return cloneDeep(this.settings[findIndex(this.settings, (item) => item.userId.toString() === userId.toString())]);
  }

  public newSetting(userId, name, val) {
    const obj = {userId, name, val};
    this.settings.push(obj);
    const newSetting = new settingsModel(obj);

    return newSetting.save();
  }

  public delSetting(userId) {
    settingsModel.remove({userId}, (err) => console.error(err));
    this.settings = remove(this.settings, (item) => item.userId === userId);
  }

  public saveSessionData(data) {
    this.session[this.chatId].data = extend(this.session[this.chatId].data, data);
  }

  public getSessionData() {
    return cloneDeep(this.session[this.chatId].data);
  }

  public newAnswer(name) {
    const newAnswer = new answersModel({name});
    newAnswer.save();
    this.answersList.push({name});
  }

  public editAnswerByName(pattern) {
    answersModel.update({_id: pattern._id}, pattern, {upsert: true}, (err) => console.error(err));
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
