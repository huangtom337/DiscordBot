const getMapValue = (map, key) => {
  if (!map.get(key)) {
    let value = [];
    map.set(key, value);
    return value;
  } else {
    return map.get(key);
  }
};

module.exports = getMapValue;
