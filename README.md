## Project Overview

This project is designed to create a batch process that computes a "Perceived Energy Score" for users in the Wysa app. The score is generated using user mood, activities, and sleep data stored in MongoDB. Additionally, this project includes functionality to insert activity and sleep data from CSV files into MongoDB.

### MongoDB Aggregation Pipeline

The batch process uses a MongoDB aggregation pipeline to retrieve the necessary data for each user on a specific date. The pipeline performs the following operations:

1. **User Data**: The pipeline starts by fetching all user data from the `User` collection.

2. **Mood Data**: 
   - Uses `$lookup` to join the `Mood` collection, fetching the `mood_score` for each user based on their mood check-in for the specified date.
   - Filters data using `$match` on the `createdAt` date field to ensure only mood scores for the specified day are included.
  
3. **Activity Data**:
   - Joins with the `Activity` collection to retrieve the user’s physical activities (e.g., steps, duration, distance) for the specified date.
   - Filters based on `startTime` and `endTime` and calculates the `Duration` of each activity (in minutes).
  
4. **Sleep Data**:
   - Joins with the `Sleep` collection to retrieve the user’s sleep information, including `sleep_score`, `hours_of_sleep`, and `hours_in_bed` for the specified date.
  
5. **Final Data Structure**:
   - The pipeline produces a structured document for each user, combining their mood score, activities, and sleep data. This document is then written to a JSON file.


## How to Start
   - Clone this repository using the git clone command
   - Replace the MongoDB connection string in the .env file
   - npm install (Install all the dependencies)
   - Run the InsertData.js file 
   - Run the index.js file 

The **Result** will be found at **output_data_2021-11-18.json** file.

