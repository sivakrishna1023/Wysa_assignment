const { MongoClient } = require('mongodb');
const fs = require('fs');

async function runBatchProcess(Pipeline,url,dbName) {
    const client = new MongoClient(url);
    try {
      
      await client.connect();
      console.log("Connected successfully to MongoDB");
  
      const db = client.db(dbName);
      const userCollection = db.collection('User');
  
      // run the aggregation pipeline
      const results = await userCollection.aggregate(Pipeline).toArray();
  
      // write results to a json file
      const fileName = `user_perceived_energy_${new Date().toISOString().split('T')[0]}.json`;
      fs.writeFileSync(fileName, JSON.stringify(results, null, 2));
      console.log(`Batch process completed. Data saved to ${fileName}.`);
      
    } catch (err) {
      console.error("Error running batch process:", err);
    } finally {
      await client.close();
    }
  }
module.exports=runBatchProcess