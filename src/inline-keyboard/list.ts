import {storageSrv} from '../services/storage';
import {InlineKeyboard} from './inline-keyboard';

export class List {
  public $inlineKeyboard() {
    const inlineKeyboard = new InlineKeyboard();

    storageSrv.getAnswers().map((item) => {
      inlineKeyboard.addButton({
        text: item.name,
        callback_data: `Edit ${item.name}`
      });
    });

    inlineKeyboard
      .chunk(4)
      .addButton({text: '🔙Back to main menu', callback_data: 'Back Main'});

    return inlineKeyboard.toString();
  }

  public $answer() {
    return 'Choose a auto answer from the list below:';
  }
}
