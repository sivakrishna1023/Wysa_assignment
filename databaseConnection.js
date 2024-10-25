const mongoose = require("mongoose");
require('dotenv').config();

const connectDatabase = () => {
  try{
    mongoose
    .connect(process.env.DB_URI)
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
  }catch(error){
    console.log("Error in connecting to DB",error);
  }
};

module.exports = connectDatabase;
