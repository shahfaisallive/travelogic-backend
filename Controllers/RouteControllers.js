const RouteModel = require('../Models/Route');
const HttpError = require('../Models/HttpError');

//ADDING NEW ROUTES
const createRoute = async(req,res,next)=>{

  const {to,from} = req.body
  let firstRoute,secondRoute
  let first_way_route = await RouteModel.find({destination_to:to,destination_from:from})
  let second_way_route = await RouteModel.find({destination_to:from,destination_from:to})

  if (first_way_route.length===0) {

    try {
      firstRoute = RouteModel()
      firstRoute.destination_to=to;
      firstRoute.destination_from=from;
      firstRoute.save()

      secondRoute = RouteModel()
      secondRoute.destination_to=from;
      secondRoute.destination_from=to;
      secondRoute.save()
    } catch (err) {
      const error = new HttpError('Creating Route failed',500);
      return next(error);
    }
      
  }
  else {
    const error = new HttpError('Route Already Added',500);
    return next(error);
  }
  
  res.send({firstRoute,secondRoute})
}
//Does route exists
const doesRouteExist = async(req,res,next)=>{

  const {destination_to,destination_from} = req.body
  let route 
  try {
     route = await RouteModel.find({destination_to:destination_to,destination_from:destination_from}).populate('destination_to destination_from', 'name').exec()
  } 
  catch (err) {
    // console.log(err)
    const error = new HttpError('Finding Route failed, please try again',500);
    return next(error);
  }

  if (route.length===0) {
    res.send({status:'Sorry, Direct Route Does Not Exists'}) 
  }
  else{
    res.send({status:'Yay! This Route is Possible '})  
  }
  
}

//GET ALL ROUTES
const getRoutes = async(req,res,next)=>{

  let routes 
  try {
     routes = await RouteModel.find().populate('destination_to destination_from','name').exec()
  } 
  catch (err) {
    const error = new HttpError('finding Routes failed, please try again',500);
    return next(error);
  }

  if (!routes) {
    const error = new HttpError('could not find any Routes',404);
    return next(error);
  }
  
  res.send(routes)
}

//DELETE ROUTE BY ID
const deleteRouteById =  async (req,res,next) => {
  let id = req.params.id
  let route 
  try {
    route = await RouteModel.findByIdAndDelete(id)
  } 
  catch (err) {
    const error = new HttpError('deleting Route failed, please try again',500);
    return next(error);
  }
  if (!route) {
    const error = new HttpError('could not find an Route for the provided id.',404);
    return next(error);
  }
  res.send(route)
}

//GET ROUTES ADMIN
const getRoutesAdmin = async (req,res,next) => {
  RouteModel.find().populate('destination_to destination_from', 'name -_id').exec(function(err,data){
  if(err){
    const error = new HttpError('getting Routes failed, please try again',500);
    return next(error);
  }
  else{
    res.send(data)
  }
  })
}


//EXPORTING CONTROLLERS
module.exports.createRoute  = createRoute;
module.exports.getRoutes  = getRoutes;
module.exports.getRoutesAdmin  = getRoutesAdmin;
module.exports.deleteRouteById  =deleteRouteById;
module.exports.doesRouteExist  =doesRouteExist;
