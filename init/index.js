require('dotenv').config();
const mongoose = require("mongoose");
const Listing = require("../models/listings.js");
const initData = require("./data.js");

const dbsURL = process.env.ATLASDB_URL;

main()
.then(() => {
    console.log("database connection successful ")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbsURL);

};

const initDb = async () => {
    await Listing.deleteMany({});//clean all pre exisiting data
    await Listing.insertMany(initData.data);// inserting all the data from scratch
    console.log("Data was initialised!");
};

initDb();