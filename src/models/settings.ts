import {model, Schema} from 'mongoose';

export const settingsSchema = new Schema({
  name: String,
  val: Boolean,
  userId: {
    type: String,
    unique: 'unique'
  }
});

export const settingsModel = model('settings', settingsSchema);
