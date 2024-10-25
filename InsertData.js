const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const  User = require('./Schema/UserCollection'); 
const {Mood}=require('./Schema/MoodCollection');
const {Activity}=require('./Schema/ActivityCollection');
const {Sleep}=require('./Schema/SleepCollection');
require('dotenv').config();
const connectDatabase=require('./databaseConnection');

connectDatabase();

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

const insertUsers = async (userIDs) => {
  const users = userIDs.map((user) => ({
    _id: new mongoose.Types.ObjectId(),
    name: user,
    timezone: 'Americas/Los Angeles',
    version: 1,
    app: 'Wysa',
    country: 'US',
  }));
  await User.insertMany(users);
  console.log('Inserted Users:', users);
};

const insertMoods = async (userIDs) => {
  const moods = userIDs.map((user) => ({
    _id: new mongoose.Types.ObjectId(),
    field: 'mood_score',
    user: user._id,
    value: Math.floor(Math.random() * 10) + 1,
  }));
  await Mood.insertMany(moods);
  console.log('Inserted Mood Data:', moods);
};


const insertActivities = async (activities) => {
  const activityDocs = activities.map((activity) => ({
    _id: new mongoose.Types.ObjectId(),
    user: activity.User,
    activity: activity.Activity,
    startTime: new Date(`${activity.Date} ${activity.StartTime}`),
    endTime: new Date(`${activity.Date} ${activity.EndTime}`),
    steps: Number(activity.Steps),
    distance: Number(activity.Distance),
    calories: Number(activity.Calories),
    logType: activity.LogType,
  }));
  await Activity.insertMany(activityDocs);
  console.log('Inserted Activity Data:', activityDocs);
};

const insertSleep = async (sleepData) => {
  const sleepDocs = sleepData.map((sleep) => ({
    _id: new mongoose.Types.ObjectId(),
    user: sleep.USER,
    sleepScore: Number(sleep['SLEEP SCORE']),
    hoursOfSleep: sleep['HOURS OF SLEEP'],
    hoursInBed: sleep['HOURS IN BED'],
  }));
  await Sleep.insertMany(sleepDocs);
  console.log('Inserted Sleep Data:', sleepDocs);
};

const runInserts = async () => {
  try {
    const activityData = await parseCSV('./activity_data.csv');
    const sleepData = await parseCSV('./sleep_data.csv');
    const userIDs = [...new Set([...activityData.map((d) => d.User), ...sleepData.map((d) => d.USER)])];

    await insertUsers(userIDs);
    await insertMoods(userIDs);
    await insertActivities(activityData);
    await insertSleep(sleepData);

    console.log('All data inserted successfully!');
  } catch (err) {
    console.error('Error inserting data:', err);
  } finally {
    mongoose.connection.close();
  }
};

// Run the data insertions
runInserts();
