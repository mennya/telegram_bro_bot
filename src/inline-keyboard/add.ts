import {InlineKeyboard} from './inline-keyboard';

export class Add {
  public $inlineKeyboard() {
    const inlineKeyboard = new InlineKeyboard();

    inlineKeyboard
      .addButton({text: 'Back', callback_data: 'Back Main'});

    return inlineKeyboard.toString();
  }

  public $answer() {
    return `OK, now send me a name for your auto answer.\nShould be a word without spaces, using only Latin ` +
      `and Cyrillic alphabet, less than 10 letters.\nCurrently list is limited to 28 elements.`;
  }
}
