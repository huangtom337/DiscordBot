const fetchURL = require('../../../helpers/fetchURL');

const bestbuyDailyScraper = async (subscription) => {
  const locationIds = subscription.locationIds;
  const currInStoreStatus = subscription.inStoreStatus;
  const currOnlineStatus = subscription.onlineStatus;
  const sku = subscription.sku;

  const stockInfoApi = `https://www.bestbuy.ca/ecomm-api/availability/products?accept=application%2Fvnd.bestbuy.simpleproduct.v1%2Bjson&accept-language=en-CA&locations=${locationIds}&postalCode=&skus=${sku}`;
  const stockInfojson = await fetchURL(stockInfoApi).catch(() => null);

  if (!stockInfojson) throw Error('product no longer exists');

  const totalNumOfProducts = stockInfojson.availabilities.length;
  for (let i = 0; i < totalNumOfProducts; i++) {
    const product = stockInfojson.availabilities[i];

    const inStoreStatus = product.pickup.status;
    const onlineStatus = product.shipping.status;

    if (
      (inStoreStatus === 'InStock' && currInStoreStatus !== 'InStock') ||
      (onlineStatus === 'InStock' && currOnlineStatus !== 'InStock')
    ) {
      return subscription;
    }
  }
};
module.exports = bestbuyDailyScraper;
