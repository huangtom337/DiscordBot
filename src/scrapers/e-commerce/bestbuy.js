const fetchURL = require('../../helpers/fetchURL');

const getNearByStores = async (city, region) => {
  // find nearby stores
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
  return locationIDs.join('%7C');
};

const getQueriedProducts = async (item) => {
  // query item
  const productInfoApi = `https://www.bestbuy.ca/api/v2/json/search?&currentRegion=&include=facets%2C%20redirects&lang=en-CA&page=1&pageSize=24&path=&query=${item}&exp=search_abtesting_5050_conversion%3Ab&sortBy=relevance&sortDir=desc`;
  const productInfojson = await fetchURL(productInfoApi).catch(() => null);

  //0 search results
  if (productInfojson.total === 0 || !productInfojson) {
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
  return products;
};

const getProductStatus = async (products, locationIDs) => {
  //will be in order of the inserted skus, so we can just traverse normally without mapping. standardproduct(shows which locations has inventory)

  //concat strings for api search
  const skus = products.map((product) => product.sku).join('%7C');
  const stockInfoApi = `https://www.bestbuy.ca/ecomm-api/availability/products?accept=application%2Fvnd.bestbuy.simpleproduct.v1%2Bjson&accept-language=en-CA&locations=${locationIDs}&postalCode=&skus=${skus}`;

  //find availability for each item
  const stockInfojson = await fetchURL(stockInfoApi);
  const totalNumOfProducts = stockInfojson.availabilities.length;
  //add info property to products
  for (let i = 0; i < totalNumOfProducts; i++) {
    const product = stockInfojson.availabilities[i];

    products[i].inStorePurchase = product.pickup.status;
    products[i].onlinePurchase = product.shipping.status;
    products[i].locationIDs = locationIDs;

    product.pickup.status === 'InStock' || product.shipping.status === 'InStock'
      ? (products[i].canBeNotified = false)
      : (products[i].canBeNotified = true);
  }

  return products;
};

const bestBuyScraper = async ({ item, location }) => {
  // location based

  const locationIDs = await getNearByStores(city, region);

  let products = await getQueriedProducts(item);

  return await getProductStatus(products, locationIDs);
};

module.exports = bestBuyScraper;
