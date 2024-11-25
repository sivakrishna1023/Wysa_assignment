const mongoose = require("mongoose");
require('dotenv').config();

const url=process.env.DB_URL;
const dbName=process.env.DB_NAME;

const connectDatabase = () => {
  try{
    mongoose.connect(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: dbName
      }).then((data)=>{
        console.log(`Mongoose is connected to server:${data.connection.host}`);
      })
}catch(error){
    console.log("Error in connecting to database");
}
};

module.exports = connectDatabase;
