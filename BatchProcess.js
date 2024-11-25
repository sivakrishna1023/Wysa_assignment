const { MongoClient } = require('mongodb');
const fs = require('fs');

const Pipeline = require('./Pipeline');
const { pipeline } = require('stream');
const url = "mongodb+srv://sivakrishnachukkala:S3JATWL1wO7C8Xf5@cluster0.7kbww.mongodb.net";
const dbName = "Wysa";

async function runBatchProcess(Pipeline, url, dbName) {
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

runBatchProcess(Pipeline, url, dbName);

module.exports = runBatchProcess;
