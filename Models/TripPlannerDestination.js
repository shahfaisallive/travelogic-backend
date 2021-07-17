const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const TripPlannerDestinationSchema = mongoose.Schema({
    name: { type: String , required:true,unique:true},
    north_coordinate:{type:mongoose.Types.Decimal128,required:true},
    east_coordinate:{type:mongoose.Types.Decimal128,required:true}
},{ timestamps: true});

TripPlannerDestinationSchema.plugin(uniqueValidator)

const TripPlannerDestinationModel = mongoose.model('TripPlannerDestination', TripPlannerDestinationSchema);

module.exports =TripPlannerDestinationModel;
