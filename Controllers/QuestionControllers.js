const QuestionModel = require('../Models/Question');
const HttpError = require('../Models/HttpError');

//ADD NEW QUESTION
const createQuestion = async (req,res,next)=> {

  const {user,statement,description,reported,topic}=req.body
  console.log(user,statement,description,reported,topic)
  let question = QuestionModel()
  question.user=user
  question.topic=topic
  question.statement =statement
  question.description=description
  question.reported=reported

  try {
    await question.save()
  } catch (err) {
    const error = new HttpError('creating Question failed, please try again',500)
    return next(error);
  }
  res.status(201).send(question);
}

//GET ALL QUESTIONS
const getQuestions = async(req,res,next)=>{

  let questions 
  try {
     questions = await QuestionModel.find().populate('user', 'name display_image_name -_id')
  } 
  catch (err) {
    const error = new HttpError('finding Questions failed, please try again',500)
    return next(error);
  }

  if (!questions) {
    const error = new HttpError('could not find Questions',404);
    return next(error);
  }
  
  res.send(questions)
}
//GET QUESTIONS ADMIN
const getQuestionsAdmin = async (req,res,next) => {
  QuestionModel.find().populate('user', 'name -_id').exec(function(err,data){
  if(err){
    const error = new HttpError('getting Questions failed, please try again',500);
    return next(error);
  }
  else{
    res.send(data)
  }
  })
}
//GET REPORTED ANSWERS ADMIN
const getReportedQuestionsAdmin = async (req,res,next) => {
  QuestionModel.find({reported:true}).populate('user', 'name -_id').exec(function(err,data){
  if(err){
    const error = new HttpError('getting Questions failed, please try again',500);
    return next(error);
  }
  else{
    res.send(data)
  }
  })
}
//GET A QUESTION BY ID
const getQuestionbyId = async(req,res,next)=>{

  let question
  const id=req.params.id
  console.log(id)
  try {
    question = await QuestionModel.findById(id).populate('user', 'name display_image_name -_id')
  } 
  catch (err) {
    const error = new HttpError('Unknown error occured while finding question, please try again.',500);
    return next(error);
  }
  if (!question) {
    const error = new HttpError('could not find a Question for the provided id',404);
    return next(error);
  }
  res.send(question)
}

//UPDATE A QUESTION BY ID
const updateQuestionbyId = async(req,res,next)=>{

  let question
  const id=req.params.id
  const {statement}=req.body
  try {
    question = await QuestionModel.findByIdAndUpdate(id,{statement:statement})
  } 
  catch (err) {
    const error = new HttpError('Unknown error occured while updating question, please try again.',500);
    return next(error);
  }
  if (!question) {
    const error = new HttpError('could not find a Question for the provided id.',404);
    return next(error);
  }
  res.send(question)
}

//DELETING QUESTION BY ID
const deleteQuestionbyId = async(req,res,next)=>{

  let question
  let id =req.params.id
  try {
    question = await QuestionModel.findByIdAndDelete(id)
  } 
  catch (err) {
    const error = new HttpError('unknown error occured while deleting Question, please try again',500);
    return next(error)
  }
  if (!question) {
    const error = new HttpError('could not find a Question for the provided id.',404);
    return next(error);
  }
  res.send(question)
}

const getQuestionsByTopic = async (req,res,next)=>{
  let questions
  try {
    questions = await QuestionModel.find({ topic: req.params.name }).populate('user', 'name display_image_name -_id').exec();
  } catch (error) {
    const err = new HttpError('unknown error occured while finding Question, please try again',500);
    return next(err)
  }
  if(questions.length===0){
    const err = new HttpError('No Questions Found',500);
    return next(err)
  }
  else{

    res.send(questions)
  }
}
const addViewToQuestionbyId = async (req,res,next)=>{
  const {user} =req.body
  const id = req.params.id
  console.log(user,id)
  let view,question
  try {
   view = await QuestionModel.find({ _id: id, views: user });
   console.log('view',view)
  } catch (error) {
    const err = new HttpError('Finding View Failed',500);
    return next(err)
  }
  if(view.length===0){
    question = await QuestionModel.findByIdAndUpdate(id,
      { 
        "$push": { "views": user } 
      },{returnOriginal:false}
    ).populate('user', 'name display_image_name -_id');
    res.send(question)
  }
  else{
    question = await QuestionModel.findById(id).populate('user', 'name display_image_name -_id');
    res.send(question)
  }
  
}

const getMostViewedQuestions = async (req,res,next)=>{
  const aggregate =  [
   { $project: { user:1,topic:2,statement: 3, description:4,createdAt:5, numberOfViews: { $cond: { if: { $isArray: "$views" }, then: { $size: "$views" }, else: 0} }
   }},
   {$sort:{"numberOfViews":-1}},
   { $limit: 5 },
   { $lookup: {from: 'users', localField: 'user', foreignField: '_id', as: 'user'} }
	]
	const results = await QuestionModel.aggregate(aggregate).exec()
	console.log('results',results)
	res.send(results)
  
}

const getQuestionsbyUserId = async (req,res,next)=>{
  let id = req.params.id
  let questions
  try {
    questions = await QuestionModel.find({ user:id }).populate('user', 'name display_image_name -_id').exec();
  } catch (error) {
    const err = new HttpError('unknown error occured while finding Question, please try again',500);
    return next(err)
  }
  if (questions.length===0){
    const err = new HttpError('No Questions Found',500);
    return next(err)
  }
  else{

    res.send(questions)
  }
}

const reportQuestion = async (req,res,next)=>{
  
  let id = req.params.id
  let question;
  try {
     question= QuestionModel.findByIdAndUpdate(id,{reported:true})
  } catch (error) {
    const err = new HttpError('Finding Question Failed',500);
    return next(err)
  }
  res.send(question)
}

//EXPORTING CONTROLLERS
module.exports.getQuestions  = getQuestions
module.exports.getQuestionbyId  =getQuestionbyId
module.exports.updateQuestionbyId  = updateQuestionbyId
module.exports.createQuestion  = createQuestion
module.exports.getQuestionsAdmin  = getQuestionsAdmin
module.exports.getReportedQuestionsAdmin  = getReportedQuestionsAdmin
module.exports.deleteQuestionbyId=deleteQuestionbyId
module.exports.getQuestionsByTopic =getQuestionsByTopic 
module.exports.addViewToQuestionbyId =addViewToQuestionbyId 
module.exports.getMostViewedQuestions =getMostViewedQuestions 
module.exports.reportQuestion =reportQuestion 
module.exports.getQuestionsbyUserId =getQuestionsbyUserId 
