import { defineMongooseModel } from '#nuxt/mongoose'
import type { ObjectId } from 'mongoose'

type Car = {
	_id: ObjectId
	adId: number
	contactMobiles_1: string
	contactMobiles_2: string
	contactMobiles_3: string
	contactWhatsapp_1: string
	contactWhatsapp_2: string
	contactWhatsapp_3: string
	user: {
		username: string
	}
	cylinder: {
		cylinderName: string
	}
	engineSize: string
	fuelType: {
		fuelTypeName: string
	}
	vehicleMake: {
		makeName: string
	}
	vehicleModel: {
		modelName: string
	}
	year: {
		yearName: string
	}
	price: string
	milage: string
	images: {
		image: {
			uri: string
		}
	}[]
	status: number
	isBrandNew: boolean
	isPromoted: boolean
	installmentsAvailable: boolean
	urls: {
		urlAlias: string
	}[]
	location: {
		locationName: string
	}
	isShowroom: boolean
	isShowroomRequired: boolean
	isBasic: boolean
}

export const CarSchema = defineMongooseModel<Car>({
	name: 'Car',
	schema: {
		adId: { type: Number, required: true },
		contactMobiles_1: { type: String, required: true },
		contactMobiles_2: { type: String, required: false },
		contactMobiles_3: { type: String, required: false },
		contactWhatsapp_1: { type: String, required: true },
		contactWhatsapp_2: { type: String, required: false },
		contactWhatsapp_3: { type: String, required: false },
		user: {
			username: { type: String, required: true }
		},
		cylinder: {
			cylinderName: { type: String, required: true }
		},
		engineSize: { type: String, required: true },
		fuelType: {
			fuelTypeName: { type: String, required: true }
		},
		vehicleMake: {
			makeName: { type: String, required: true }
		},
		vehicleModel: {
			modelName: { type: String, required: true }
		},
		year: {
			yearName: { type: String, required: true }
		},
		price: { type: String, required: true },
		milage: { type: String, required: true },
		images: [
			{
				image: {
					uri: { type: String, required: true }
				}
			}
		],
		status: { type: Number, required: true },
		isBrandNew: { type: Boolean, required: true },
		isPromoted: { type: Boolean, required: true },
		installmentsAvailable: { type: Boolean, required: true },
		urls: [
			{
				urlAlias: { type: String, required: true }
			}
		],
		location: {
			locationName: { type: String, required: true }
		},
		isShowroom: { type: Boolean, required: true },
		isShowroomRequired: { type: Boolean, required: true },
		isBasic: { type: Boolean, required: true }
	}
})