const mongoose = require("mongoose");
require('dotenv').config();

const connectDatabase = () => {
  try{
    mongoose.connect("mongodb+srv://sivakrishnachukkala:S3JATWL1wO7C8Xf5@cluster0.7kbww.mongodb.net",{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: `Wysa`
      }).then((data)=>{
        console.log(`Mongoose is connected to server:${data.connection.host}`);
      })
}catch(error){
    console.log("Error in connecting to database");
}
};

module.exports = connectDatabase;
