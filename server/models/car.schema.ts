import { defineMongooseModel } from '#nuxt/mongoose'
import type { ObjectId } from 'mongoose'

type Car = { // Just an example
	_id: ObjectId
	make: string
	model: string
	year: number
	price: number
}


export const CarSchema = defineMongooseModel<Car>({
	name: 'Car',
	schema: {
		make: {
			type: 'string',
			required: true
		},
		model: {
			type: 'string',
			required: true
		},
		year: {
			type: 'Number',
			default: 0,
			required: true
		},
		price: {
			type: 'Number',
			required: true
		}
	},
})