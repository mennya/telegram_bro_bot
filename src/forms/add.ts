import {storageSrv} from '../services/storage'
import {AddEnd} from '../inline-keyboard/add-end'
import {IForm} from './form'
import {subscription} from '../services/subscribtion'

export class AddForm implements IForm {
	public chatId
	public keyboard = new AddEnd()

	constructor(msg) {
		this.chatId = msg.chat.id
	}

	public validate(msg) {
		if (msg.text.length > 10) {
			return 'Should be less than 10 symbols!'
		}
		if (msg.text.indexOf(' ') >= 0) {
			return 'No spaces!'
		}
		if (!new RegExp('[A-Za-zа-яА-Я]+').test(msg.text)) {
			return 'Only Latin and Cyrillic alphabet!'
		}
		if (storageSrv.getAnswers().some((item) => item.name === msg.text)) {
			return `Such name already exists!`
		}
		storageSrv.newAnswer(msg.text)
		subscription.notify('add new answer', msg.text)
	}
}
