const mongoose = require ('mongoose');

const HotelSchema = mongoose.Schema({
    title: { type: String , required:true},
    destination:{type : mongoose.Schema.ObjectId, ref : 'TripPlannerDestination',required:true},
    luxury_rent:{type : Number, required:true},
    budget_rent:{type : Number, required:true},
    contact_number:{type:Number,required:true},
},{ timestamps: true});

const HotelModel = mongoose.model('Hotel', HotelSchema);
module.exports =HotelModel;
