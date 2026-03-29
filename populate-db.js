import mongoose from "mongoose";

await mongoose.connect(process.env.MONGO_URI, { serverApi: { version: '1', strict: true, deprecationErrors: true } })
  .catch(err => { console.error(err); process.exit(1); });

console.log("Database Connected");

// SCHEMA - EDIT THIS
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
} catch (error) {
  console.error(error);
}
mongoose.connection.close();



// PROCESS DATA FUNCTION
async function processData(cars) {
  let filteredCars = cars.filter((car) => car.adId !== null);
  console.log(cars[0]);
  console.log("All:", cars.length, "Filtered:", filteredCars.length);

  await Car.insertMany(filteredCars, { rawResult: true }).catch((error) => console.error(error));
}