const fetchURL = require('../helpers/fetchURL');

const bestBuyScraper = async ({ item, city, region }) => {
  // location based
  // find postal code of city
  const locationIDsApi = `https://www.bestbuy.ca/api/v3/json/locations/locate?includeStores=true&lang=en-CA&region=${region}&city=${city}`;
  const locationIDsjson = await fetchURL(locationIDsApi).catch(() => null);

  if (!locationIDsjson) throw Error('Please enter a valid location');

  if (locationIDsjson.nearbyStores.length === 0)
    throw Error('No stores near your location');

  const locations = locationIDsjson.nearbyStores;
  let locationIDs = [];
  locations.forEach(
    (location) => (locationIDs = [...locationIDs, location.locationId])
  );

  // string concat to match bestbuy api style
  locationIDs = locationIDs.join('%7C');

  // query item
  const productInfoApi = `https://www.bestbuy.ca/api/v2/json/search?&currentRegion=&include=facets%2C%20redirects&lang=en-CA&page=1&pageSize=24&path=&query=${item}&exp=search_abtesting_5050_conversion%3Ab&sortBy=relevance&sortDir=desc`;
  const productInfojson = await fetchURL(productInfoApi).catch(() => null);

  //0 search results
  if (productInfojson.total === 0) {
    throw Error('Item not found');
  }

  //get top 5 results //* maybe can get user to input how many results
  const products = productInfojson.products.slice(0, 5).map((product) => {
    return {
      sku: product.sku,
      name: product.name,
      productUrl: `https://www.bestbuy.ca${product.productUrl}`,
      salePrice: product.salePrice,
      thumbnailImage: product.thumbnailImage,
    };
  });

  //concat strings for api search
  const skus = products.map((product) => product.sku).join('%7C');

  //will be in order of the inserted skus, so we can just traverse normally without mapping. standardproduct(shows which locations has inventory)
  const stockInfoApi = `https://www.bestbuy.ca/ecomm-api/availability/products?accept=application%2Fvnd.bestbuy.simpleproduct.v1%2Bjson&accept-language=en-CA&locations=${locationIDs}&postalCode=&skus=${skus}`;

  //find availability for each item
  const stockInfojson = await fetchURL(stockInfoApi);
  const totalNumOfProducts = stockInfojson.availabilities.length;
  //add info property to products
  for (let i = 0; i < totalNumOfProducts; i++) {
    const product = stockInfojson.availabilities[i];

    products[i].inStorePurchase = checkInStoreStatus(product.pickup.status);
    products[i].onlinePurchase = checkOnlineStatus(product.shipping.status);
    products[i].locationIDs = locationIDs;
  }
  return products;
};

const checkInStoreStatus = (itemStatus) => {
  switch (itemStatus) {
    case 'InStock':
      return 'Item is in stock';

    case 'OutOfStock':
      return 'Item is out of stock';

    case 'Preorder':
      return 'Item can be preordered online';

    case 'OnlineOnly':
      return 'Item can only be purchased online';

    default:
      return itemStatus;
  }
};

const checkOnlineStatus = (itemStatus) => {
  switch (itemStatus) {
    case 'InStock':
      return 'Item is in stock';

    case 'SoldOutOnline':
      return 'Item is out of stock';

    case 'Preorder':
      return 'Item can be preordered online';

    case 'InStoreOnly':
      return 'Item can only be purchased in store';

    case 'InStockOnlineOnly':
      return 'Item is in stock';

    default:
      return itemStatus;
  }
};

module.exports = bestBuyScraper;
