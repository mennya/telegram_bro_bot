import {CONFIG} from '../config'
import {connection, connect} from 'mongoose'
import {bot} from '../services/bot'

class Mongo {
	public db

	constructor() {
		connection.on('error', errHandler)
		connect(CONFIG.MONGOLAB_URI, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true
		})

		this.db = connection
		this.db.on('error', errHandler)

		this.db.once('open', () => console.log('mongodb opened'))
	}
}

function errHandler(error) {
	bot.sendErr(`DB ${error}`)
	console.log(error)
}

export const mongo = new Mongo()
