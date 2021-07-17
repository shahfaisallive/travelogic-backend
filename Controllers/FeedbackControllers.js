const FeedbackModel = require('../Models/Feedback')
const HttpError = require('../Models/HttpError');
const {thankyouEmail}= require('../public/emailTemplate')
const nodemailer = require('nodemailer');

//CREATE FEEDBACK
const createFeedback = async (req,res,next)=>{

  
  const {name,email,message,phone}= req.body
  const output = thankyouEmail(name)
  let feedback
  try {
    feedback= FeedbackModel()
    feedback.name=name
    feedback.email=email
    feedback.message=message
    feedback.phone=phone
    await feedback.save()
  } catch (err) {
    const error = new HttpError('Creating Feedback failed',500);
    return next(error);
  }


  var mailOptions = {
    from: 'info@travelogic.pk',
    to: email,
    subject: 'Feedback Response',
    text: 'Sent!',
    html: output,
  }

  let mail = nodemailer.createTransport({
    host: "travelogic.pk",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "info@travelogic.pk", // generated ethereal user
      pass: "Travelogic@2021", // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false
      }
  });

  mail.verify(function(error, success) {
    if (error) {
      console.log();
      res.send('err msg > '+ error.message, 'err stk'+error.stack,'err name'+error.name,error)
    } 
    else {
      console.log("Server is ready to take our messages");
      mail.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error.message);
          res.send('err msg > '+ error.message, 'err stk'+error.stack,'err name'+error.name,error)
        } else {
          console.log('Email sent With Attachment: ' + info.response);
          res.send({'Mail Sent':email,"Feedback":feedback})
        }
      });
    }
  });
}
//GET ALL FEEDBACK
const getFeedback = async (req,res,next)=>{
  
  let feedback
  try {
    feedback= await FeedbackModel.find()
  } catch (err) {
    const error = new HttpError('Finding Feedback failed',500);
    return next(error);
  }
  if (feedback.length===0){
    const error = new HttpError('No Feedback Found',500);
    return next(error);
  }
  res.send(feedback)
}
module.exports.createFeedback  =  createFeedback
module.exports.getFeedback  =  getFeedback
