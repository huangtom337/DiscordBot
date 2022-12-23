const fetchURL = require('../helpers/fetchURL');

const bestBuyScraper = async (item, city) => {
  // location based
  // find postal code of city
  const postalCodeCityApi = `https://www.bestbuy.ca/api/v3/json/locations/locate?includeStores=false&lang=en-CA&city=${city}`;
  const postalCodeCityjson = await fetchURL(postalCodeCityApi).catch(
    () => null
  );

  if (!postalCodeCityjson) throw Error('City not found');

  let postalCode = postalCodeCityjson.postalCode;

  // if postalCode from city api is null, check using the region api
  if (!postalCode) {
    const region = postalCodeCityjson.region;
    const postalCodeRegionApi = `https://www.bestbuy.ca/api/v3/json/locations/locate?includeStores=false&lang=en-CA&region=${region}`;
    const postalCodeRegionjson = await fetchURL(postalCodeRegionApi).catch(
      () => null
    );
    if (!postalCodeRegionjson.postalCode)
      throw Error('No bestbuys in your area');
    postalCode = postalCodeRegionjson.postalCode;
  }

  // find locationIDs for the postalcode
  postalCode = postalCode.split(' ').join(''); //remove potential white spaces
  const locationIDApi = `https://www.bestbuy.ca/api/v3/json/locations?lang=en-CA&postalCode=${postalCode}`;
  const locationIDjson = await fetchURL(locationIDApi).catch(() => null);

  //should be redundent
  if (!locationIDjson) throw Error('Postal code not found');

  const locations = locationIDjson.locations;
  let locationIDs = [];
  locations.forEach(
    (location) => (locationIDs = [...locationIDs, location.locationId])
  );

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

  //will be in order of the inserted skus, so we can just traverse normally without mapping
  const stockInfoApi = `https://www.bestbuy.ca/ecomm-api/availability/products?accept=application%2Fvnd.bestbuy.simpleproduct.v1%2Bjson&accept-language=en-CA&locations=${locationIDs}&postalCode=${postalCode}&skus=${skus}`;

  //find availability for each item
  const stockInfojson = await fetchURL(stockInfoApi);
  const totalNumOfProducts = stockInfojson.availabilities.length;
  //add info property to products
  for (let i = 0; i < totalNumOfProducts; i++) {
    const product = stockInfojson.availabilities[i];

    products[i].inStorePurchase = checkInStoreStatus(product.pickup.status);
    products[i].onlinePurchase = checkOnlineStatus(product.shipping.status);
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
