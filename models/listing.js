const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string, required } = require("joi");

// main().then((res)=>{
//     console.log("conncted to DB");
// })
// .catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

// }



const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
    image: {
    //     type: String,
    //     default:"https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=scott-webb-1ddol8rgUH8-unsplash.jpg",
    //    set: (v) => v === "" ? "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=scott-webb-1ddol8rgUH8-unsplash.jpg"
    //    : v,


    url: String,
    filename: String,
    },
    
    price: Number,
    location: String,
    country:String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"

    },
    
    
});

//mongoose middelware handling post deletion

listingSchema.post("findOneAndDelete", async(list)=>{
    if(list){
        await Review.deleteMany({id_: {$in: list.reviews}});
    }
});



const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;