const Listing = require("../models/listing.models.js");
const Review = require("../models/reviews.model.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.addReview = async (req, res, next) => {
    let listId = req.params;
    let listing = await Listing.findById(listId.id);
    let { rating, comment } = req.body;

    let newReview = new Review({
        comment: comment,
        rating: rating
    });

    newReview.reviewer = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review created!");
    res.redirect(`/listings/${listId.id}`);
}

module.exports.deleteReview = async(req, res, next) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}