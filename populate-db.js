import mongoose from "mongoose";
import "dotenv/config"

await mongoose.connect(process.env.MONGO_URI, { serverApi: { version: '1', strict: true, deprecationErrors: true }, dbName: "qliving_api_mirror" })
  .catch(err => { console.error(err); process.exit(1); });
await mongoose.pluralize(null); // Use singular collection names
console.log("Database Connected");
// SCHEMA - EDIT THIS

const imageSchema = new mongoose.Schema({
  image: { type: Object }, // adjust if you know exact structure
  viewpoint: { type: String, default: null }
}, { _id: false });

const carSchema = new mongoose.Schema({
  adId: { type: Number, unique: true, required: true },

  contactMobiles_1: String,
  contactMobiles_2: String,
  contactMobiles_3: String,
  contactWhatsapp_1: String,
  contactWhatsapp_2: String,
  contactWhatsapp_3: String,

  user: {
    username: { type: String }
  },

  cylinder: {
    cylinderName: { type: String }
  },

  engineSize: { type: String },

  fuelType: {
    fuelTypeName: { type: String }
  },

  vehicleMake: {
    makeName: { type: String }
  },

  vehicleModel: {
    modelName: { type: String }
  },

  year: {
    yearName: { type: String }
  },

  price: { type: String },
  milage: { type: String },

  images: [imageSchema],

  status: { type: Number },

  isBrandNew: { type: Boolean },
  isPromoted: { type: Boolean },
  installmentsAvailable: { type: Boolean },

  urls: [
    {
      urlAlias: { type: String }
    }
  ],

  location: {
    locationName: { type: String }
  },

  isShowroom: { type: Boolean },
  isShowroomRequired: { type: Boolean },
  isBasic: { type: Boolean }

}, { timestamps: true });

const Car = mongoose.model("cars", carSchema);

const MetaSchema = new mongoose.Schema({
  totalPages: Number,
  totalResults: Number,
});
const Metadata = mongoose.model("metadata", MetaSchema);


try {
  let page = 1;
  let res = await fetch(`https://bo-prod.qatarliving.com/vehicles?cur_page=${page}&per_page=50`);
  let data = await res.json();
  await Metadata.deleteMany({});
  await Metadata.create({
    totalPages: data.meta.totalPages,
    totalResults: data.meta.totalResults
  });
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
  await Car.insertMany(filteredCars, { rawResult: true }).then((res) => console.log(`${res.acknowledged ? '✅' : '❌'} Inserted ${res.insertedCount} cars`)).catch((error) => console.error(error));

}