export type Car = {
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
		imageUrl: string
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