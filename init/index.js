const mongoose = require("mongoose");
let initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then((res)=>{
    console.log("conncted to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initDB = async () =>{
  await  Listing.deleteMany({});
  initData.data = initData.data.map(obj =>({...obj, owner:'6854f398dc60ea39d0744bb2', }));
  await Listing.insertMany(initData.data);
  console.log("data was initializze");
};  
initDB();