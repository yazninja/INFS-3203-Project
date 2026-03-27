
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
// IMPORTS
const mongoose = require("mongoose");

// CONNECT TO MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/qatarCars")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// SCHEMA
const carSchema = new mongoose.Schema({
  adID: { type: Number, unique: true },

  contactMobile_1: String,
  contactMobile_2: String,
  contactWhatsapp_1: String,
  contactWhatsapp_2: String,

  cylinder: {
    cylinderName: String,
  },

  engineSize: String,

  fuelType: {
    fuelTypeName: String,
  }

}, { timestamps: true });

const Car = mongoose.model("Car", carSchema);


// MAIN FUNCTION
async function main() {
  try {
    let page = 1;

    let res = await fetch(`https://bo-prod.qatarliving.com/vehicles?cur_page=${page}&per_page=50`);
    let data = await res.json();

    await processData(data.adsCar);

    for (let i = 2; i <= data.meta.totalPages; i++) {
      console.log(`Fetching page ${i}...`);

      res = await fetch(`https://bo-prod.qatarliving.com/vehicles?cur_page=${i}&per_page=50`);
      data = await res.json();

      await processData(data.adsCar);
    }

    console.log("All data inserted ✅");
    mongoose.connection.close();

  } catch (error) {
    console.error("Error:", error);
    mongoose.connection.close();
  }
}


// PROCESS DATA FUNCTION
async function processData(data) {
  try {
    const formattedData = data.map(item => ({
      adID: item.adID,

      contactMobile_1: item.contactMobile_1,
      contactMobile_2: item.contactMobile_2,
      contactWhatsapp_1: item.contactWhatsapp_1,
      contactWhatsapp_2: item.contactWhatsapp_2,

      cylinder: {
        cylinderName: item.cylinder?.cylinderName
      },

      engineSize: item.engineSize,

      fuelType: {
        fuelTypeName: item.fuelType?.fuelTypeName
      }
    }));

    // insert into MongoDB (skip duplicates automatically)
    await Car.insertMany(formattedData, { ordered: false });

    console.log(`Inserted ${formattedData.length} cars`);

  } catch (error) {
    console.error("Insert error:", error.message);
  }
}


// RUN SCRIPT
main();