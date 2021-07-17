const TripPlannerDestinationModel = require('../Models/TripPlannerDestination');
const HttpError = require('../Models/HttpError');

const createTripPlannerDestination = async (req,res,next)=>{
  const {name,north_coordinate,east_coordinate} = req.body
  let newDest
  let dest = await TripPlannerDestinationModel.find({name: name })
  if (dest.length===0){
    try {
      newDest = TripPlannerDestinationModel()
      newDest.name=name
      newDest.north_coordinate=north_coordinate
      newDest.east_coordinate=east_coordinate
      newDest.save()
    } catch (error) {
      const err = new HttpError('Creating TripPlannerDestination Failed',500);
      return next(err)
    }
  }
  else{
    const err = new HttpError('Destination Already Exists',500);
    return next(err)
  }
  res.send(newDest)
}

const getAllTripPlannerDestinations = async (req,res,next)=>{
  let destinations
  try {
     destinations = await TripPlannerDestinationModel.find().sort('name')
  } catch (error) {
    const err = new HttpError('Getting Trip Planner Destinations Failed, please try again',500);
    return next(err);
  }
  if (!destinations) {
    const error = new HttpError('could not find any destinations',404);
    return next(error);
  }
  res.send(destinations)
}

const getTripPlannerDestionationById = async (req,res,next)=>{
  let destinations
  let id = req.params.id
  try {
     destinations = await TripPlannerDestinationModel.findById(id)
  } catch (error) {
    const err = new HttpError('Getting Trip Planner Destination Failed, please try again',500);
    return next(err);
  }
  if (!destinations) {
    const error = new HttpError('Could not find any Trip Planner Destination',404);
    return next(error);
  }
  res.send(destinations)
}

const getTripPlannerDestinationByCoordinates = async (req,res,next)=>{
  
  const {to,from} = req.body
  try {
    if (to>from){
      destinations = await TripPlannerDestinationModel.where('north_coordinate').gt(from).lte(to).select('name').sort('name').exec();
    }
    else {
      destinations = await TripPlannerDestinationModel.where('north_coordinate').gte(to).lt(from).select('name').sort('name').exec();
    }
  } catch (error) {
    const err = new HttpError('Getting Trip Planner Destination Faile, please try again',500);
    return next(err);
  }
  if (!destinations) {
    const error = new HttpError('Could not find any Trip Planner Destination',404);
    return next(error);
  }
  res.send(destinations)
}


const getTripPlannerDestinationById = async (req,res,next)=> {

  const {to,from} = req.body
  let to_destination
  let from_destination
  try {

     to_destination = await TripPlannerDestinationModel.findById(to)
     from_destination = await TripPlannerDestinationModel.findById(from)

    // console.log("to",parseFloat(to_destination.north_coordinate.toString()),"from",parseFloat(from_destination.north_coordinate.toString()))
    
    if (parseFloat(to_destination.north_coordinate.toString())>parseFloat(from_destination.north_coordinate.toString()))
    {
      destinations = await TripPlannerDestinationModel.where('north_coordinate')
      .gt(parseFloat(from_destination.north_coordinate.toString()))
      .lte(parseFloat(to_destination.north_coordinate.toString()))
      .select('name').sort('name').exec();
    }
    else {
      destinations = await TripPlannerDestinationModel.where('north_coordinate')
      .gte(parseFloat(from_destination.north_coordinate.toString()))
      .lt(parseFloat(from_destination.north_coordinate.toString()))
      .select('name').sort('name').exec();
    }
  } catch (error) {
    const err = new HttpError('Getting Trip Planner Destination Failed, please try again',500);
    return next(err);
  }
  if (!destinations) {
    const error = new HttpError('Could not find any Trip Planner Destination',404);
    return next(error);
  }
  res.send(destinations)
}

const deleteTripPlannerDestinationById = async (req,res,next)=>{
  let destinations
  let id = req.params.id
  try {
     destinations = await TripPlannerDestinationModel.findByIdAndDelete(id)
  } catch (error) {
    const err = new HttpError('Getting Trip Planner Destination Failed, please try again',500);
    return next(err);
  }
  if (!destinations) {
    const error = new HttpError('Could not find any Trip Planner Destination',404);
    return next(error);
  }
  res.send(destinations)
}


module.exports.createTripPlannerDestination = createTripPlannerDestination
module.exports.getAllTripPlannerDestinations  = getAllTripPlannerDestinations
module.exports.getTripPlannerDestionationById  = getTripPlannerDestionationById
module.exports.deleteTripPlannerDestinationById  = deleteTripPlannerDestinationById
module.exports.getTripPlannerDestinationByCoordinates = getTripPlannerDestinationByCoordinates
module.exports.getTripPlannerDestinationById  = getTripPlannerDestinationById

