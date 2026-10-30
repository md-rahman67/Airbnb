const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.model.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,

    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (data) => {
  if (data) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
