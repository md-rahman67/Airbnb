const mongoose = require("mongoose");
const Listing = require("../models/listing.models.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
main().then(()=>{
    console.log("connection to mongoDB");
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("inited");
}

initDB();

