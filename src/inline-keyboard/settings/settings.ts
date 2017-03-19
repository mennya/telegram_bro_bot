import {InlineKeyboard} from '../inline-keyboard';

export class Settings {
  public $inlineKeyboard() {
    const inlineKeyboard = new InlineKeyboard();

    inlineKeyboard
      .addButton({text: `Subscribe?`, callback_data: `Subscribe`})
      .newLine()
      .addButton({text: 'Back to main menu', callback_data: 'Back Main'});

    return inlineKeyboard.toString();
  }

  public $answer() {
    return `Settings:`;
  }
}
