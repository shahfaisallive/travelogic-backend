const mongoose = require ('mongoose');

const ChatSchema = mongoose.Schema({
    message: {type : String,required:true},
    send:{type:Number,required:true}//if 0 sent by admin, if 1 sent by user
},{ timestamps: true});

module.exports.ChatSchema = mongoose.model('Chat', ChatSchema);

const ChatroomSchema = mongoose.Schema({
    user: {type : mongoose.Schema.ObjectId, ref : 'User',required:true},
    chat : [ChatSchema]
},{ timestamps: true});

const ChatroomModel = mongoose.model('Chatroom', ChatroomSchema);
module.exports = ChatroomModel;
