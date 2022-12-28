const {
  getAllSubscriptions,
  deleteFromDatabase,
} = require('../helpers/dataBaseQueries.js');
const { Collection, bold } = require('discord.js');
const getMapValue = require('../helpers/getMapValue.js');
const client = require('../client');
const dailyEcommerceResponseBuilders = require('../helpers/responseBuilders/dailyEcommerceResponseBuilder.js');

// TODO: implement query for all items in database and notifiy user
// TODO: find out if its possible to store locationIDs
const dailyScrapesEcommerce = async () => {
  const docsSnap = await getAllSubscriptions('ecommerce');
  const sites = new Collection(); // {site: [{user: [sku1, sku2]}]}
  const userSubscriptions = new Collection(); // {user: [sku1, sku2]}
  const toBeNotified = new Collection(); // {id: [sku1, sku2]}}

  docsSnap.forEach((doc) => {
    const data = doc.data();
    const userId = data.userId;
    const productId = data.productId;
    const sku = productId.split('/')[1];
    const site = data.embed[0].author.name;
    const locationIds = data.locationIDs;
    const inStoreStatus = data.status.inStore;
    const onlineStatus = data.status.online;
    const url = data.embed[0].url;
    const title = data.embed[0].title;
    const thumbnailImage = data.embed[0].thumbnail.url;

    // add sku to specific user  {user: [sku1, sku2]}
    getMapValue(userSubscriptions, userId).push({
      sku,
      locationIds,
      inStoreStatus,
      onlineStatus,
      site,
      url,
      title,
      thumbnailImage,
    });

    // add user to corresponding site  {site: {user: [sku1, sku2]}, user2: [sku1, sku2]}}
    sites.set(site, userSubscriptions);
  });

  for (const [site, users] of sites) {
    const dailyScraper = require(`./dailyScrapes/ecommerceDaily/${site}Daily`);

    // for each user subscribed to this site
    for (const [userId, subscriptions] of users) {
      for (const subscription of subscriptions) {
        const response = await dailyScraper(subscription); //the sku that needs to be notified
        if (!response) continue;

        // if status is in stock, {userId: [sku1, sku2]}
        getMapValue(toBeNotified, userId).push(response);
      }
    }
  }

  if (!toBeNotified) return;

  for (const [userId, subscriptions] of toBeNotified) {
    const User = await client.users.fetch(userId);
    const builderResponse = await dailyEcommerceResponseBuilders(
      subscriptions
    ).catch((err) => {
      User.send(err);
      return null;
    });

    // delete item from database since it no longer exists
    if (!builderResponse) {
      const productId = userId + '/' + subscriptions.sku;
      deleteFromDatabase(productId, 'ecommerce').catch(() => {
        throw Error(err);
      });
      return;
    }
    await User.send({
      content: bold('The following items are in stock'),
      embeds: builderResponse,
    });
  }
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
