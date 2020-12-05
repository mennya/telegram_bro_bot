import {InlineKeyboard} from '../inline-keyboard'
import {storageSrv} from '../../services/storage'
import {ICallbackQuery} from '../../services/bot-callback'

export class Subscribe {
	private pref
	private userId

	constructor(private callbackQuery: ICallbackQuery, private action) {
		this.userId = this.callbackQuery.from.id
	}

	public $inlineKeyboard() {
		const inlineKeyboard = new InlineKeyboard()
		let settings
		if (this.action[1] === 'sub') {
			storageSrv.newSetting(this.userId, 'subscribe', true)
			settings = {userId: this.userId, name: 'subscribe', val: true}
		} else if (this.action[1] === 'unsub') {
			storageSrv.delSetting(this.userId)
		} else {
			settings = storageSrv.getUserSettings(this.userId)
		}
		const enabled = settings && settings.val

		const action = enabled === true ? 'unsub' : 'sub'
		const curPref = enabled === true ? 'un' : ''
		this.pref = enabled === true ? '' : 'un'

		inlineKeyboard
			.addButton({text: `${curPref}Subscribe`, callback_data: `Subscribe ${action}`})
			.newLine()
			.addButton({text: 'Back settings', callback_data: 'Back Settings'})

		return inlineKeyboard.toString()
	}

	public $answer() {
		return `You are currently ${this.pref}Subscribed from all changes. \nDo you want to subscribe?\n` +
			`By subscribing you will receive notification on any change of auto answers.`
	}
}
