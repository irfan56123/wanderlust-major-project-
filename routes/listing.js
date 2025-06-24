const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const wrapAsync = require("../utills/wrapAsync.js");
const ExpressError = require("../utills/ExpressError.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");


const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer( { storage });

const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if (error){
        throw new ExpressError(400, error);
    }else {
        next();
    } 
   

};



// index route

router.get("/", wrapAsync(listingController.index));

//new route

router.get("/new", isLoggedIn,listingController.new );

// show route

router.get("/:id", wrapAsync(listingController.show));

// creat route

router.post("/", upload.single('listing[image]'),validateListing, wrapAsync(listingController.creat));

//edit route

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.edit));
// update route
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.update));
//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroy));


module.exports = router;