const mongoose = require ('mongoose');

const RouteSchema = mongoose.Schema({
    destination_to:{type : mongoose.Schema.ObjectId, ref : 'TripPlannerDestination'},
    destination_from:{type : mongoose.Schema.ObjectId, ref : 'TripPlannerDestination'}
},{ timestamps: true});

const RouteModel = mongoose.model('Route', RouteSchema);
module.exports =RouteModel;
