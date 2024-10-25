const pipeline = [
    {
      $match: {
        updatedAt: {
        $gte: new Date("2021-11-18T00:00:00.000Z"),
        $lt: new Date("2021-11-19T00:00:00.000Z")
        }}
    },
    {
      $lookup: {
        from: "Mood",
        localField: "_id",
        foreignField: "user",
        as: "moodData"
      }
    },
    {
      $lookup: {
        from: "Activity",
        localField: "_id",
        foreignField: "user",
        as: "activityData"
      }
    },
    {
      $lookup: {
        from: "Sleep",
        localField: "_id",
        foreignField: "user",
        as: "sleepData"
      }
    },
    {
      $unwind: {
        path: "$moodData",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: "$activityData",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $unwind: {
        path: "$sleepData",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        user: "$_id",
        name: 1,
        date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$updatedAt"
          }
        },
        mood_score: "$moodData.value",
        activity: {
          activity: "$activityData.activity",
          steps: "$activityData.steps",
          distance: "$activityData.distance",
          duration: {
            $divide: [{ $subtract: ["$activityData.endTime", "$activityData.startTime"] }, 60000]
          }
        },
        sleep: {
          sleep_score: "$sleepData.sleep_score",
          hours_of_sleep: {
            $dateToString: {
              format: "%H:%M:%S",
              date: { $subtract: ["$sleepData.hours_of_sleep", "$sleepData.hours_in_bed"] }
            }
          },
          hours_in_bed: "$sleepData.hours_in_bed"
        }
      }
    },
    {
      $group: {
        _id: {
          user: "$user",
          date: "$date"
        },
        mood_score: { $first: "$mood_score" },
        activities: { $push: "$activity" },
        sleep: { $first: "$sleep" }
      }
    }
  ];
  

module.exports=pipeline