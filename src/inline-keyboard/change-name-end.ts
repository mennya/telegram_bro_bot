import {InlineKeyboard} from './inline-keyboard';

export class ChangeNameEnd {
  public $inlineKeyboard() {
    const inlineKeyboard = new InlineKeyboard();

    inlineKeyboard
      .addButton({text: '🔙Back to main menu', callback_data: 'Back Main'})
      .addButton({text: '🔙Back to list', callback_data: 'Back List'});

    return inlineKeyboard.toString();
  }

  public $answer() {
    return `Success! Name updated..`;
  }
}
