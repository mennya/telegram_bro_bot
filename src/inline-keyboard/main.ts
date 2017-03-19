import {InlineKeyboard} from './inline-keyboard';

export class Main {
  public $inlineKeyboard() {
    const inlineKeyboard = new InlineKeyboard();

    inlineKeyboard
      .addButton({text: 'Settings', callback_data: `Settings`})
      .newLine()
      .addButton({text: 'List auto answers', callback_data: `List`})
      .newLine()
      .addButton({text: 'Add new auto answer', callback_data: 'Add'});

    return inlineKeyboard.toString();
  }

  public $answer() {
    return `Hello from BRO BOT!\nWhat can i do for you?`;
  }
}
