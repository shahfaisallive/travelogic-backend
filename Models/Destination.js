const mongoose = require('mongoose');

const ratingSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
)

const Schema = mongoose.Schema;
const DestinationSchema = new Schema({
    title: { type: String, required: true },
    title_image: { type: String },
    UserRatings: [ratingSchema],
    rating: { type: Number, required: true, default: 0 },
    numRating: { type: Number, required: true, default: 0 },
    introduction: { type: String, required: true },
    attraction_photos: [{
        title: { type: String },
        path: { type: String }
    }],
    photos: [{
        path: { type: String }
    }],
    guidelines: { type: String, required: true },
    history: { type: String, required: true },
}, { timestamps: true });


const DestinationModel = mongoose.model('Destination', DestinationSchema);
module.exports = DestinationModel;
