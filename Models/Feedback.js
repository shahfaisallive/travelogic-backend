const mongoose = require ('mongoose');

const FeedbackSchema = mongoose.Schema({
    name: {type:String,required:true},
    email:{type:String,required:true},
    message:{type:String,required:true},
    phone:{type:Number,required:true}
},{ timestamps: true});

const FeedbackModel = mongoose.model('Feedback', FeedbackSchema);
module.exports = FeedbackModel;
