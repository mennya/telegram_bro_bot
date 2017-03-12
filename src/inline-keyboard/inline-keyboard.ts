import {chunk} from 'lodash';

interface IInlineKeyboardButton {
  // Label text on the button
  text: string;
  // HTTP url to be opened when button is pressed
  url?: string;
  // Data to be sent in a callback query to the bot when button is pressed, 1-64 bytes
  callback_data?: string;
  /**
   * If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot‘s
   * username and the specified inline query in the input field. Can be empty, in which case just the bot’s username
   * will be inserted.
   * Note: This offers an easy way for users to start using your bot in inline mode when they are currently in a
   * private chat with it. Especially useful when combined with switch_pm… actions – in this case the user will be
   * automatically returned to the chat they switched from, skipping the chat selection screen.
   */
  switch_inline_query?: string;
  /**
   * If set, pressing the button will insert the bot‘s username and the specified inline query in the current chat's
   * input field. Can be empty, in which case only the bot’s username will be inserted.
   */
  switch_inline_query_current_chat?: string;
  /**
   * Description of the game that will be launched when the user presses the button.
   * NOTE: This type of button must always be the first button in the first row.
   */
  callback_game?: string;
}

export class InlineKeyboard {
  private keyboards = [];
  private keyboardCurLine = [];

  public addButton(button: IInlineKeyboardButton) {
    this.keyboardCurLine.push(button);

    return this;
  }

  /**
   * Create a new line in keyboard
   */
  public newLine() {
    this.keyboards.push(this.keyboardCurLine);
    this.keyboardCurLine = [];

    return this;
  }

  /**
   * Split current buttons into lines of {num} buttons, also returns a new line, no need to call newLine method
   * @param num How much ich chunk should have items?
   * @returns {InlineKeyboard}
   */
  public chunk(num: number) {
    chunk(this.keyboardCurLine, num).forEach((item) => this.keyboards.push(item));
    this.keyboardCurLine = [];

    return this;
  }

  public toString() {
    this.keyboards.push(this.keyboardCurLine);

    return JSON.stringify({
      inline_keyboard: this.keyboards
    });
  }
}
