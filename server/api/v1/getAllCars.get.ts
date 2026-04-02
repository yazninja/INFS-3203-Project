export default defineEventHandler(async (event) => {
	// Example:
	try {
		const fromDB = await CarSchema.find()
		return fromDB.map(car => ({
			id: car.adId,
			make: car.vehicleMake.makeName,
			model: car.vehicleModel.modelName,
			year: Number(car.year.yearName),
			mileage: Number(car.milage),
			price: Number(car.price),
			engine: car.engineSize,
			images: car.images.map(img => img.imageUrl),
			location: car.location.locationName,
			contact: {
				mobile: [car.contactMobiles_1, car.contactMobiles_2, car.contactMobiles_3].filter(Boolean),
				whatsapp: [car.contactWhatsapp_1, car.contactWhatsapp_2, car.contactWhatsapp_3].filter(Boolean)
			},
			badges: {
				isBrandNew: car.isBrandNew,
				isPromoted: car.isPromoted,
				installmentsAvailable: car.installmentsAvailable,
				isShowroom: car.isShowroom,
				isShowroomRequired: car.isShowroomRequired,
				isBasic: car.isBasic
			}

		}))

	} catch (error) {
		console.error('Error fetching cars:', error)
		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error',
			message: 'An error occurred while fetching cars.'
		})
	}
})