const { Product, WorkingHours, Restaurant } = require("../models");
const schedule = require("node-schedule");

let days = ["pazar", "pazartesi", "sali", "carsamba", "persembe", "cuma", "cumartesi"];

let openRestaurant = (minute, hour, day) => {
  const rule = new schedule.RecurrenceRule();
  rule.hour = hour;
  rule.minute = minute;
  rule.dayOfWeek = day;
  rule.tz = "Asia/Istanbul";
  
  schedule.scheduleJob(days[day] + "Acilis", rule, async function () {
    let rest = await Restaurant.findOne();
    await Restaurant.findByIdAndUpdate(rest._id, { $set: { open: true } }, (err, doc) => {
      if (err) {
        console.log(err);
      }
    });
  });
};

let closeRestaurant = (minute, hour, day, openHour) => {
  const rule = new schedule.RecurrenceRule();
  rule.hour = hour;
  rule.minute = minute;
  rule.dayOfWeek = (openHour>hour)? day+1: day;
  rule.tz = "Asia/Istanbul";

  
  schedule.scheduleJob(days[day] + "Kapanis", rule, async function () {
    let rest = await Restaurant.findOne();
    await Restaurant.findByIdAndUpdate(rest._id, { $set: { open: false } }, (err, doc) => {
      if (err) {
        console.log(err);
      }
    });
  });
};

module.exports = {
  closeProductDaily: async (productId) => {
    let today = new Date();
    let day = today.getDay() + 1;
    let workingHours = await WorkingHours.findOne();
    let workingHour = parseInt(workingHours[days[day] + "Acilis"].split(":")[0]);
    let workingMinute = parseInt(workingHours[days[day] + "Acilis"].split(":")[1]);

    const rule = new schedule.RecurrenceRule();
    rule.hour = workingHour;
    rule.minute = workingMinute;
    rule.dayOfWeek = day;
    rule.tz = "Asia/Istanbul";

    schedule.scheduleJob(productId, rule, async function () {
      await Product.findByIdAndUpdate(productId, { $set: { open: true } }, (err, doc) => {
        if (err) {
          console.log(err);
        }
      });
      schedule.scheduledJobs[productId].cancel();
    });
  },

  openCloseRestaurantSchedule: async () => {
    
    let workingHours = await WorkingHours.findOne();
    
    for (i = 0; i < 7; i++) {
      let openHour = parseInt(workingHours[days[i] + "Acilis"].split(":")[0]);
      let openMinute = parseInt(workingHours[days[i] + "Acilis"].split(":")[1]);
      let closeHour = parseInt(workingHours[days[i] + "Kapanis"].split(":")[0]);
      let closeMinute = parseInt(workingHours[days[i] + "Kapanis"].split(":")[1]);

      openRestaurant(openMinute, openHour, i);
      closeRestaurant(closeMinute, closeHour, i,openHour);
    }
  },
};
