const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const UserModel = require('../Models/User');
const HttpError = require('../Models/HttpError');
const AdminModel = require('../Models/Admin')

const auth = async (req,res,next) =>{
  let token
  if(req.headers.authorization)
  token = req.headers.authorization.split(' ')[1]
  if(!token){
    const error = new HttpError('Not Authorized',500);
    return next(error);
  }
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user= await UserModel.findById(decoded.id)
    next()
  } catch (err) {
    const error = new HttpError('Not Authorized',500);
    return next(error);
  }
}


// Admin protected auth
const protectAdmin = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.admin = await AdminModel.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports.auth= auth
module.exports.protectAdmin= protectAdmin

