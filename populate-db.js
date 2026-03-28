

import mongoose from "mongoose";
const username = encodeURIComponent("mongo-project-admin");
const password = encodeURIComponent("VQskSyEgrsoG7BER");

await mongoose.connect(`mongodb://mongo-project-admin:${password}@ac-slezrux-shard-00-00.h2qjrjg.mongodb.net:27017,ac-slezrux-shard-00-01.h2qjrjg.mongodb.net:27017,ac-slezrux-shard-00-02.h2qjrjg.mongodb.net:27017/?ssl=true&replicaSet=atlas-ycbz1z-shard-0&authSource=admin&appName=project-qatarcars`, { serverApi: { version: '1', strict: true, deprecationErrors: true } })
  .catch(err => { console.error(err); process.exit(1); });

console.log("Database Connected");

// SCHEMA
const carSchema = new mongoose.Schema({
  adId: { type: Number, unique: false },

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



// PROCESS DATA FUNCTION
async function processData(cars) {
  let filteredCars = cars.filter((car) => car.adId !== null);
  console.log(cars[0]);
  console.log("All:", cars.length, "Filtered:", filteredCars.length);

  await Car.insertMany(filteredCars, { rawResult: true }).catch((error) => console.error(error));
}