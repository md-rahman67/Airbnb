const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/reviews.model.js");
const joiReviewSchema = require("../review.joi.js"); //* Using joi validation for review server-side form validation;
const ExpressError = require("../utils/ExpressError.js"); //* custom error class to handle errors;
const Listing = require("../models/listing.models.js");



//TODO-> Middlewares--------------------------------

//* validating review data before saving to the database;
const revValidation = ((req, res, next) => {
    let {error} = joiReviewSchema.validate(req.body);

    if(error){
        console.log(error);
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
})

//* Routes-------------------------------

//* POST REQ -> Add review route
router.post("/", revValidation, async (req, res, next) => {
    let listId = req.params;
    let listing = await Listing.findById(listId.id);
    let { rating, comment } = req.body;

    let newReview = new Review({
        comment: comment,
        rating: rating
    });

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review created!");
    res.redirect(`/listings/${listId.id}`);
})

//* Delete Review Route
router.delete("/:reviewId", async(req, res, next) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
})

module.exports = router;