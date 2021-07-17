const mongoose = require ('mongoose');

const connectDB = async => mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true,useFindAndModify: false })
.then( async ()=> {
    console.log('connected to MongoDB... LEZZZZ GO !!!!!');
}).catch(err=>{
    console.log('Error connecting...');
    console.log(err)
})

module.exports = connectDB

