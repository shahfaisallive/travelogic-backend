const AnswerModel = require('../Models/Answer');
const HttpError = require('../Models/HttpError');

//ADDING NEW ANSWER
const createAnswer = async(req,res,next)=>{

  const {user,text,reported,question} = req.body
  let answer = AnswerModel()
  answer.user=user
  answer.text=text
  answer.question=question
  answer.reported=reported
  
  try {
    await answer.save()
  } 
  catch (err) {
    const error = new HttpError('creating Answer failed',500);
    return next(error);
  }
  res.send(answer)
}

//GETTING ALL ANSWERS
const getAnswers = async (req,res,next) => {
  let answers
  try {
    answers = await AnswerModel.find()
  } 
  catch (err) {
    const error = new HttpError('getting Answers failed, please try again',500);
    return next(error);
  }
  if (!answers) {
    const error = new HttpError('could not find Answers',404);
    return next(error);
  }
  res.send(answers)
}
//GETTING ALL ANSWERS BY QUESTION ID
const getAnswersByQuestionId = async (req,res,next) => {
  let answers
  try {
    answers = await AnswerModel.find({ question: req.params.id }).populate('user', 'name display_image_name _id').exec()
  } 
  catch (err) {
    const error = new HttpError('getting Answers failed, please try again',500);
    return next(error);
  }
  if (!answers) {
    const error = new HttpError('could not find Answers',404);
    return next(error);
  }
  res.send(answers)
}
//DELETE ANSWER BY ID
const deleteAnswerbyId =  async (req,res,next) => {
  let id = req.params.id
  let answer 
  try {
    answer = await AnswerModel.findByIdAndDelete(id)
  } 
  catch (err) {
    const error = new HttpError('deleting Answer failed, please try again',500);
    return next(error);
  }
  if (!answer) {
    const error = new HttpError('could not find an Answer for the provided id.',404);
    return next(error);
  }
  res.send(answer)
}

//GET ANSWERS ADMIN
const getAnswersAdmin = async (req,res,next) => {
  AnswerModel.find().populate('user', 'name -_id').exec(function(err,data){
  if(err){
    const error = new HttpError('getting Answers failed, please try again',500);
    return next(error);
  }
  else{
    res.send(data)
  }
  })
}
//GET REPORTED ANSWERS ADMIN
const getReportedAnswersAdmin = async (req,res,next) => {
  AnswerModel.find({reported:true}).populate('user', 'name -_id').exec(function(err,data){
  if(err){
    const error = new HttpError('getting Answers failed, please try again',500);
    return next(error);
  }
  else{
    res.send(data)
  }
  })
}

//UPDATING ANSWER BY ID
const updateAnswerbyId = async(req,res,next)=>{
  let id = req.params.id;
  const {text} = req.body
  let answer
  try {
    answer = await AnswerModel.findOneAndUpdate(id,{text:text})
  } 
  catch (err) {
    const error = new HttpError('deleting Answer failed, please try again',500);
    return next(error) 
  }
  if (!answer) {
    const error = new HttpError('could not find an Answer for the provided id.',404);
    return next(error);
  }
  res.send(answer)
}

const reportAnswer = async (req,res,next)=>{
  
  let id = req.params.id
  let question;
  try {
     question= AnswerModel.findByIdAndUpdate(id,{reported:true})
  } catch (error) {
    const err = new HttpError('Finding Answer Failed',500);
    return next(err)
  }
  res.send(question)
}
//EXPORTING CONTROLLERS
module.exports.createAnswer  = createAnswer;
module.exports.getAnswers  = getAnswers;
module.exports.getAnswersByQuestionId  = getAnswersByQuestionId
module.exports.getAnswersAdmin  = getAnswersAdmin;
module.exports.deleteAnswerbyId  = deleteAnswerbyId;
module.exports.getReportedAnswersAdmin  = getReportedAnswersAdmin;
module.exports.updateAnswerbyId  = updateAnswerbyId;
module.exports.reportAnswer  = reportAnswer
