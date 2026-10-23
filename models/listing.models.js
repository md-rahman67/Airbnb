const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.model.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://i.pinimg.com/736x/88/6d/ee/886deef5fe74814c14f446a7b1ac5ecb.jpg",
        set: (v) => v === ""? "https://i.pinimg.com/736x/88/6d/ee/886deef5fe74814c14f446a7b1ac5ecb.jpg" : v
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete", async(data) => {
    if(data){
        await Review.deleteMany({_id: {$in: data.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;