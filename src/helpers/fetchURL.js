const fetchURL = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(response.status);
  }
  return json;
};

module.exports = fetchURL;
