const { MongoClient } = require('mongodb');
require('dotenv').config();
const fs = require('fs');

const url=process.env.DB_URL;
const dbName=process.env.DB_NAME;

async function runBatchProcess(url, dbName) {
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const db = client.db(dbName);
    const userCollection = db.collection('users'); 

    const result = await userCollection.aggregate([
      {
        $lookup: {
          from: "sleeps",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: "latestSleep"
        }
      },
      { $unwind: { path: "$latestSleep", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "moods",
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$user", "$$userId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: "latestMood"
        }
      },
    
      { $unwind: { path: "$latestMood", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "activities",
          localField: "_id",
          foreignField: "user",
          as: "activities"
        }
      },

      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: 1,
          latestSleep: {
            sleepScore: "$latestSleep.sleepScore",
            hoursOfSleep: "$latestSleep.hoursOfSleep"
          },
          latestMoodScore: "$latestMood.value",
          activities: {
            $map: {
              input: "$activities",
              as: "activity",
              in: {
                activityName: "$$activity.activity",
                steps: "$$activity.steps",
                distance: "$$activity.distance",
                calories: "$$activity.calories"
              }
            }
          }
        }
      }
    ]).toArray(); 

    const fileName = `user_perceived_energy_${new Date().toISOString().split('T')[0]}.json`;

    fs.writeFileSync(fileName, JSON.stringify(result, null, 2));
    console.log(`Batch process completed. Data saved to ${fileName}.`);

    console.log("Aggregation result:", JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Error running batch process:", err);
  } finally {
    await client.close();
  }
}

runBatchProcess(url, dbName);

module.exports = runBatchProcess;
