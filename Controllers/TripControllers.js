const TripModel = require('../Models/Trip');
const HttpError = require('../Models/HttpError');
const multer = require('multer')
const sharp = require('sharp')
const fs = require("fs")


//IMAGE HANDLING
const multerStorage = multer.diskStorage({
  // destination:(req,file,cb)=>{
  //   cb(null,'public/images/users')
  // },
  // filename:(req,file,cb)=>{
  //   const ext = file.mimetype.split('/')[1];
  //   cb(null,`user-${req.body.id}-${Date.now()}.${ext}`)
  // }
})

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  }
  else {
    cb('error')
  }
}
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

exports.uploadTripPhoto = upload.single('photo')



//Add dispalay image to trip
const addImagetoTrip = async (req, res, next) => {

  console.log('ere')
  const { id,name } = req.body
  let trip, tempPath
  // buffer = req.file.buffer
  req.file.filename = `trip-${name}-${Date.now()}.jpeg`;
  //  let file=req.file
  // console.log(file)
  await sharp(req.file.path).resize({ width: 800, height: 600 }).toFile(`./uploads/trips/${req.file.filename}`)
  try {
    trip = await TripModel.findById(id)
    tempPath = 'uploads\\trips\\' + trip.display_image
    // console.log('tempapth',tempPath)
    trip.display_image = req.file.filename
    trip.save()
  } catch (err) {
    const error = new HttpError('Updating User Failed', 500);
    return next(error);
  }
  if (!trip) {
    const error = new HttpError('No Such User Found', 500);
    return next(error);
  }

  if (tempPath !== 'uploads\\trips\\default.jpg') {
    fs.unlink(tempPath, function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log("Successfully deleted the previous")
      }
    })
  }
  res.send(trip)

}

//ADD A TRIP
const createTrip = async (req, res, next) => {

  const { title, price, description, attractions, excludes, service_provided, start_date, end_date, itinerary, company } = req.body
  let trip = TripModel()
  trip.title = title
  trip.price = price
  trip.description = description
  trip.rating = 0
  trip.attractions = attractions
  trip.excludes = excludes
  trip.service_provided = service_provided
  trip.display_image = 'default.jpg'
  trip.start_date = start_date
  trip.end_date = end_date
  trip.itinerary = itinerary
  trip.company = company
  trip.numReviews = 0

  try {
    await trip.save()
  } catch (err) {
    const error = new HttpError('creating Trip failed, please try again', 500);
    return next(error);
  }
  res.status(201).send(trip);
}

//UPDATE TRIP BY ID
const updateTripById = async (req, res, next) => {

  let id = req.params.id

  const { title, price, description, attractions, excludes, service_provided, start_date, end_date, itinerary, company } = req.body

  
  let trip;
  try {
      trip = await TripModel.findById(id);
  } catch (err) {
      const error = new HttpError('Unknown error occured while updating Trip, please try again.',500);
      return next(error);
  }
  trip.title = title
  trip.price = price
  trip.description = description
  trip.attractions = attractions
  trip.excludes = excludes
  trip.service_provided = service_provided
  trip.start_date = start_date
  trip.end_date = end_date
  trip.itinerary = itinerary
  trip.company = company

  try {
    await trip.save()
  } catch (err) {
    const error = new HttpError('updating Trip failed, please try again', 500);
    return next(error);
  }
  res.status(201).send(trip);
}

//GET ALL TRIPS
const getTrips = async (req, res, next) => {

  let trips
  try {
    trips = await TripModel.find()
  }
  catch (err) {
    const error = new HttpError('finding Trips failed, please try again', 500);
    return next(error);
  }

  if (!trips) {
    const error = new HttpError('could not find trips', 404);
    return next(error);
  }

  res.send(trips)
}

//GET ANSWERS ADMIN
const getTripsAdmin = async (req, res, next) => {
  TripModel.find().populate('user', 'name -_id').exec(function (err, data) {
    if (err) {
      const error = new HttpError('getting Answers failed, please try again', 500);
      return next(error);
    }
    else {
      res.send(data)
    }
  })
}


//GET TRIP BY ID
const getTripbyId = async (req, res, next) => {

  let id = req.params.id
  let trip
  try {
    trip = await TripModel.findById(id)
  }
  catch (err) {
    const error = new HttpError('finding Trip failed, please try again', 500);
    return next(error);
  }

  if (!trip) {
    const error = new HttpError('could not find a trip by that id', 404);
    return next(error);
  }

  res.send(trip)
}

//DELETE TRIP BY ID
const deleteTripById = async (req, res, next) => {

  let id = req.params.id
  let trip
  try {
    trip = await TripModel.findByIdAndDelete(id)
  }
  catch (err) {
    const error = new HttpError('deleting Trip failed, please try again', 500);
    return next(error);
  }

  if (!trip) {
    const error = new HttpError('could not find a trip by that id', 404);
    return next(error);
  }

  res.send(trip)
}


// CREATE A CUSTOMER REVIEW
const createTripReview = async (req, res) => {
  const { rating, comment } = req.body

  const trip = await TripModel.findById(req.params.id)

  if (trip) {
    const alreadyReviewed = trip.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('This Trip is already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    trip.reviews.push(review)

    trip.numReviews = trip.reviews.length

    trip.rating =
      trip.reviews.reduce((acc, item) => item.rating + acc, 0) /
      trip.reviews.length

    await trip.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Trip not found')
  }
}


//EXPORTING CONTROLLERS
module.exports.createTrip = createTrip
module.exports.updateTripById = updateTripById
module.exports.getTrips = getTrips
module.exports.getTripsAdmin = getTripsAdmin
module.exports.getTripbyId = getTripbyId
module.exports.deleteTripById = deleteTripById
module.exports.createTripReview = createTripReview
module.exports.addImagetoTrip = addImagetoTrip
