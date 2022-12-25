const { getAllSubscriptions } = require('../helpers/dataBaseQueries.js');

// TODO: implement query for all items in database and notifiy user
const dailyScrapesEcommerce = async () => {
  const docsSnap = await getAllSubscriptions();
  // const userSubscriptions = new Collection(); // {id: {skus, locationIds}}
  // const products = new Collection(); // {sku: {pickUpStatus, onlineStatus}}

  // docsSnap.forEach((doc) => {});
};

const runAtSpecificTimeOfDay = (hour, minutes, func) => {
  const twentyFourHours = 86400000;
  const now = new Date();

  // compute milliseconds until desired time
  let eta_ms =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minutes,
      0,
      0
    ).getTime() - now;

  if (eta_ms < 0) {
    eta_ms += twentyFourHours;
  }
  setTimeout(() => {
    // run once
    func();
    // run every 24 hours from now on
    setInterval(func, twentyFourHours);
  }, 1000);
};

module.exports = { runAtSpecificTimeOfDay, dailyScrapesEcommerce };
