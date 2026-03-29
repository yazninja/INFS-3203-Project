// IMPORTS
require("dotenv").config();
const mongoose = require("mongoose");

// CONNECT TO MONGODB ATLAS
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected ✅"))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

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
async function processData(cars) {
  try {
    // filter invalid data
    const filteredCars = cars.filter(car => car.adID !== null);

    const formattedData = filteredCars.map(item => ({
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

    await Car.insertMany(formattedData, { ordered: false });

    console.log(`Inserted ${formattedData.length} cars`);

  } catch (error) {
    console.error("Insert error:", error.message);
  }
}


// RUN SCRIPT
main();