const mongoose = require ('mongoose');

const AnswerSchema = mongoose.Schema({
    user: {type:mongoose.Schema.ObjectId, ref:'User', required:true},
    question:{type : mongoose.Schema.ObjectId, ref : 'Question',required:true},
    text:{type:String,maxLength:150,required:true},
    reported:{type:Boolean,default:false}
},{ timestamps: true});

const AnswerModel = mongoose.model('Answer', AnswerSchema);
module.exports = AnswerModel;
