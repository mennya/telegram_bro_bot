import {InlineKeyboard} from './inline-keyboard';

export class Main {
  public $inlineKeyboard() {
    const inlineKeyboard = new InlineKeyboard();

    inlineKeyboard
      .addButton({text: 'List', callback_data: `List`})
      .newLine()
      .addButton({text: 'Add', callback_data: 'Add'});

    return inlineKeyboard.toString();
  }

  public $answer() {
    return `Hello from Auto Answer BOT!\nWhat can i do for you?`;
  }
}
