const mongoose = require ('mongoose');

const TransportSchema = mongoose.Schema({
    company_name: { type: String , required:true},
    fare:{ type: Number , required:true},
    route:{type : mongoose.Schema.ObjectId, ref : 'Route'}
},{ timestamps: true});

const TansportModel = mongoose.model('Transport', TransportSchema);
module.exports = TansportModel;
