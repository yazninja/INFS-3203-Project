import mongoose from "mongoose";
import "dotenv/config"

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


// ✅ REPLACED PART: FETCH FROM MONGODB INSTEAD OF API
try {
  console.log("Fetching cars from MongoDB Atlas...");

  const cars = await Car.find(); // get all cars

  console.log("Total cars:", cars.length);

  // Print sample
  if (cars.length > 0) {
    console.log("Sample car:");
    console.log(cars[0]);
  }

  console.log("Data fetched successfully ✅");

} catch (error) {
  console.error(error);
}

// CLOSE CONNECTION
mongoose.connection.close();


// PROCESS DATA FUNCTION
async function processData(cars) {
  let filteredCars = cars.filter((car) => car.adId !== null);
  console.log(cars[0]);
  console.log("All:", cars.length, "Filtered:", filteredCars.length);

  await Car.insertMany(filteredCars, { rawResult: true }).catch((error) => console.error(error));
}