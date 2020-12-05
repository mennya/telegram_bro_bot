import {InlineKeyboard} from './inline-keyboard'
import {storageSrv} from '../services/storage'

export class ChangeTextEnd {
	private name
	private answer

	constructor() {
		this.name = storageSrv.getSessionData().name
		this.answer = storageSrv.getAnswerByName(this.name)
		storageSrv.editAnswerByName(this.answer)
	}

	public $inlineKeyboard() {
		const inlineKeyboard = new InlineKeyboard()

		inlineKeyboard
			.addButton({text: `🔙Back to "${this.name}"`, callback_data: `Back Edit ${this.name}`})

		return inlineKeyboard.toString()
	}

	public $answer() {
		return `Success! Text updated.`
	}
}
