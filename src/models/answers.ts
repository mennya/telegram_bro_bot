import {model, Schema} from 'mongoose'

export const answersSchema = new Schema({
	name: {
		type: String,
		unique: 'unique'
	},
	patterns: {
		type: []
	},
	text: {
		type: String
	},
	type: String
})

export const answersModel = model('answers', answersSchema)
