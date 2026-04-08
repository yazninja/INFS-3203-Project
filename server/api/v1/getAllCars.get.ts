export default defineEventHandler(async (event) => {
	const cursor = CarSchema.find().cursor();
	const encoder = new TextEncoder();
	let count = 0;
	const stream = new ReadableStream({
		async start(controller) {
			try {

				for await (const doc of cursor) {
					const map = {
						id: doc.adId || '',
						make: doc.vehicleMake.makeName || '',
						model: doc.vehicleModel.modelName || '',
						year: Number(doc.year.yearName) || 0,
						mileage: Number(doc.milage) || 0,
						price: Number(doc.price) || 0,
						engine: doc.engineSize || '',
						cylinder: doc.cylinder.cylinderName || '',
						fuel: doc.fuelType.fuelTypeName || '',
						images: doc.images?.map(img => convertImageURI(img.image.uri)) || [],
						location: doc.location.locationName || '',
						contact: {
							mobile: [doc.contactMobiles_1, doc.contactMobiles_2, doc.contactMobiles_3].filter(Boolean),
							whatsapp: [doc.contactWhatsapp_1, doc.contactWhatsapp_2, doc.contactWhatsapp_3].filter(Boolean)
						},
						badges: {
							isBrandNew: doc.isBrandNew || '',
							isPromoted: doc.isPromoted || '',
							installmentsAvailable: doc.installmentsAvailable || '',
							isShowroom: doc.isShowroom || '',
							isShowroomRequired: doc.isShowroomRequired || '',
							isBasic: doc.isBasic || ''
						}
					}
					// Each line is a standalone JSON object
					const chunk = JSON.stringify(map) + '\n';
					controller.enqueue(encoder.encode(chunk));
					count++;
					console.log(`Enqueued car with adId: ${doc.adId}, Total enqueued: ${count}`);
				}
				controller.close();
			} catch (err) {
				controller.error(err);
			}
		},
		async cancel() {
			console.log('Stream cancelled by client. Closing MongoDB cursor.');
			await cursor.close();
		}
	}, {
		highWaterMark: 10 * 1024 * 1024 // 10MB buffer to handle backpressure
	});

	// Set the specific mime-type for NDJSON
	setHeaders(event, {
		'Content-Type': 'application/x-ndjson',
		'Transfer-Encoding': 'chunked',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive',
	})

	return stream;
});

function convertImageURI(uri: string) {
	// from: prod/defender-110-3-0i6-x-dynamic-se-400ps-1773603706723/1773603706723-20260315_125901(1).jpg.jpeg
	// to: https://qlv-media-prod.qatarliving.com/ad-images-output/prod/defender-110-3-0i6-x-dynamic-se-400ps-1773603706723/thumbnail/1773603706723-20260315_125901(1).jpg_900x675.webp
	// do not remove prod/ prefix as it is required for the correct path, the base URL is added in front of it

	const parts = uri.split('/');
	const filename = parts.pop() || '';
	// just replace the last dot before the extension with _900x675.webp

	const thumbnailPath = [...parts, 'thumbnail', filename.replace(/\.([^.]+)$/, '_900x675.webp')].join('/');
	return "https://qlv-media-prod.qatarliving.com/ad-images-output/" + thumbnailPath;
}