const TripModel = require('../Models/Trip');
const QuestionModel = require('../Models/Question');
const DestinationModel = require('../Models/Destination');
const HttpError = require('../Models/HttpError');

const search = async (req,res,next)=> {
  const string = req.params.string
  try {

    const questions = await QuestionModel.find({"statement":{$regex:`${string}`, $options:'i'}}).populate('user', 'name display_image_name _id')
    const destinations = await DestinationModel.find({"title":{$regex:`${string}`, $options:'i'}})
    const trips = await TripModel.find({"title":{$regex:`${string}`, $options:'i'}})

    res.send({questions,destinations,trips})

  } catch (error) {
    const err = new HttpError('Searching Failed',500);
    return next(err)
  }
}

module.exports.search  = search
