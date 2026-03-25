
// schema:
// {
// 	adsCar: [
// 		adID: number,
// 		contactMobile_1: string,
// 		contactMobile_2: string,
// 		contactWhatsapp_1: string,
// 		contactWhatsapp_2: string,
// 		cylinder: {
// 			cylinderName: string,
// 		},
// 		engineSize: string,
// 		fuelType: {
// 			fuelTypeName: string,
// 		}...
// 	],
// 	meta: {
// 		perPage: number,
// 		curPage: number,
// 		totalPages: number,
// 		totalResults: number
// 	}
// }

let page = 1;
let data = await fetch(`https://bo-prod.qatarliving.com/vehicles?cur_page=${page}&per_page=50`).then(res => res.json());
processData(data.adsCar);
for (let i = 2; i <= data.meta.totalPages; i++) {
	data = await fetch(`https://bo-prod.qatarliving.com/vehicles?cur_page=${i}&per_page=50`).then(res => res.json());
	processData(data.adsCar);
}

function processData(data) {
	// use mongoose to save data to mongodb
}
