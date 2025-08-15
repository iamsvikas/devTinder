const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const connectionRequestModel = require("../models/connectionRequest");

cron.schedule("* 8 * * *", async () => {
  // console.log("Hello World, " + new Date());
  try {
    const yesterday = subDays(new Date(), 1);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const pendingRequests = await connectionRequestModel
      .find({
        status: "interested",
        createdAt: {
          $gte: yesterdayStart,
          $lt: yesterdayEnd,
        },
      })
      .populate("fromUserId toUserId");
    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];
    console.log(listOfEmails);

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          `New friend request pending from ${email}`,
          "there are so many friend request pending. Please log in and respond to those connection request."
        );
      } catch (err) {
        //
      }
    }
  } catch (err) {
    //
  }
});
