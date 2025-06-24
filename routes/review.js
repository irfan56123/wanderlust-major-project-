const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utills/wrapAsync.js");
const ExpressError = require("../utills/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


// validate review

const validateReview = (req, res, next)=>{
    let results = reviewSchema.validate(req.body);

    console.log(results);
    if (results.error){
        let errmsg = results.error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400, errmsg);
    }else {
        next();
    }

};

//reviews route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.reviewRoute));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;