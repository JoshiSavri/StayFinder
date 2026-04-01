// const mongoose = require("mongoose");
// const initData= require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL="mongodb://127.0.0.1:27017/airbnb";
// main().then(() =>{
//     console.log("connected to db");
// })
// .catch((err)=>{
//     console.log(err);
// });

// async function main(){
//     await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//     await Listing.deleteMany({});
//     //owner property object add each data
// initData.data = initData.data.map((obj) => ({
//   ...obj,
//   owner: new mongoose.Types.ObjectId("69b977c485aaeb251bf57350")
// }));
    
//     await Listing.insertMany(initData.data);
//     console.log("data was initialized");
// }
// initDB();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main()
  .then(() => {
    console.log("connected to db");
    initDB(); // call here AFTER connection
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("69b67d39ae4b9adca9278864")
  }));
  console.log(initData.data);
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};