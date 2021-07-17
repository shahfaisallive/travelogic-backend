const TripPlannerDestinationModel = require('../Models/TripPlannerDestination');
const HotelModel = require('../Models/Hotel');
const RouteModel = require('../Models/Route');
const mongoose = require("mongoose");
const TransportModel = require('../Models/Transport');
const HttpError = require('../Models/HttpError');


const getTripPlanEstimate = async (req,res,next)=>{
  const {destinations} =req.body
  let nextDest = 1, minHotel = 0, maxHotel = 0, routes = [], fares = [], maxTransports = [], minTransports = [], minHotels = [], maxHotels = [], transports = [], totalFare = 0, minEstimate, maxEstimate, routesDetails = [], minTransportFare = 0, maxTransportFare = 0, hotels = [], HotelDetails = [], maxHotelDetails = [], minHotelDetails = [], Hotels = [], Transports = [], luxury = [], budget = []
  for (let index = 0; index < destinations.length-1; index++) {
    if (destinations[index]==destinations[nextDest]){

      routes.push({
        destination_from:'-',
        destination_to:'-'
      })

      minTransportFare+=0
      maxTransportFare+=0
      minTransports.push({
        company_name:'-',
        fare:0
      })
      maxTransports.push({
        company_name:'-',
        fare:0
      })
      Transports.push({
        minTransportDetails:{
          company_name:'-',
          fare:0
        },
        maxTransportDetails:{
          company_name:'-',
          fare:0
        }
      })
      nextDest++
    }
    else {
      let chkroute = await RouteModel.find({'destination_from':destinations[index],'destination_to':destinations[nextDest]}).populate('destination_from destination_to')
      if (chkroute.length===0){

        let from = await TripPlannerDestinationModel.findById(destinations[index])
        let to = await TripPlannerDestinationModel.findById(destinations[nextDest])
        const error = new HttpError(`Could not Find Route between ${from.name} to ${to.name}`,404);
        return next(error);
      }
      else {
        // console.log('route id',chkroute)
        let transport = await TransportModel.find({'route':chkroute[0]._id}).sort('-fare');

        if (transport.length===0){

          let from = await TripPlannerDestinationModel.findById(destinations[index])
          let to = await TripPlannerDestinationModel.findById(destinations[nextDest])
          const error = new HttpError(`Could not Find Transport between ${from.name} to ${to.name}`,404);
          return next(error);
        }
        else {

          routes.push({
            destination_from:chkroute[0].destination_from.name,
            destination_to:chkroute[0].destination_to.name
          })
   
          minTransportFare+=transport[transport.length-1].fare
          maxTransportFare+=transport[0].fare
          minTransports.push(transport[transport.length-1])
          maxTransports.push(transport[0])
          Transports.push({
            minTransportDetails:transport[transport.length-1],
            maxTransportDetails:transport[0]
          })
          nextDest++
        }

      }
    }
  }

  //interating destination array sent from client to find hotels in each destination
  for (let index = 1; index < destinations.length; index++) {
    //aggregation framwork used to find maximum and minimum hotel rent from each destination
    const hotel_data = await HotelModel.find({"destination":destinations[index]}) 
    let dest = await TripPlannerDestinationModel.findById(destinations[index])
    if (hotel_data.length===0){
      const error = new HttpError(`Could not Find Hotel At ${dest.name}`,404);
          return next(error);
    }

    const aggregate = [
      { $match: { "destination": new mongoose.Types.ObjectId(destinations[index]) } },
      {
        $group: { _id: "$destination", HotelMin: { $min: "$budget_rent" }, HotelMax: { $max: "$luxury_rent" } }
      },
    ]

    //returns an array of object containing minimum and maximum values
    const hotel = await HotelModel.aggregate(aggregate).exec()
    console.log(hotel)

    //adding minimum and maximum hotel rent from each destination to the variables
    minHotel += hotel[0].HotelMin
    maxHotel += hotel[0].HotelMax
    HotelDetails.push({ destination: destinations[index], minHotelRent: hotel[0].HotelMin, maxHotelRent: hotel[0].HotelMax })
  }


    for (let index = 0; index < HotelDetails.length; index++) {
      minhotel = await HotelModel.findOne({'destination':HotelDetails[index].destination,'budget_rent':HotelDetails[index].minHotelRent})
      maxhotel = await HotelModel.findOne({'destination':HotelDetails[index].destination,'luxury_rent':HotelDetails[index].maxHotelRent})
      Hotels.push({
        minHotel:minhotel,
        maxHotel:maxhotel
      })
      minHotels.push(minhotel)
      maxHotels.push(maxhotel)
      
    }
   
  let newMinEstimate = minHotel+minTransportFare
  let newMaxEstimate = maxHotel+maxTransportFare


  for (let index = 0; index < destinations.length - 1; index++) {
    var day = index + 1
    var luxury_day = {
      day:day,
      route:routes[index],
      transport:{
        name:maxTransports[index].company_name,
        fare:maxTransports[index].fare
      },
      hotel:{
        name:maxHotels[index].title,
        rent:maxHotels[index].luxury_rent
      },
      total:maxTransports[index].fare+maxHotels[index].luxury_rent
    }
    var budget_day = {
      day:day,
      route:routes[index],
      transport:{
        name:minTransports[index].company_name,
        fare:minTransports[index].fare
      },
      hotel:{
        name:minHotels[index].title,
        rent:minHotels[index].budget_rent
      },
      total:minTransports[index].fare+minHotels[index].budget_rent
    }
    luxury.push(luxury_day)
    budget.push(budget_day)
  }

  res.send(
    { minTransportFare, maxTransportFare, minHotel, maxHotel, newMaxEstimate, newMinEstimate, routes, luxury, budget }
  )
}
module.exports.getTripPlanEstimate = getTripPlanEstimate
