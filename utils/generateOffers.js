const {
  getRandomValue,
  getRandomArrayElement,
  getRandomArraySubset,
} = require("../utils/utils");
const {
  types,
  checking,
  checkout,
  features,
  photos,
  locationMinX,
  locationMinY,
  locationMaxX,
  locationMaxY,
  countCreateObject,
} = require("../data/constants");

function generateOffers() {
  return Array(countCreateObject)
    .fill()
    .map((_) => ({
      author: {
        avatar: `img/avatars/user${String(getRandomValue(1, 8)).padStart(
          2,
          "0"
        )}.png`,
      },
      offer: createOffer(),
    }));
}

function createOffer() {
  const locationPointX = getRandomValue(locationMinX, locationMaxX, 5);

  const locationPointY = getRandomValue(locationMinY, locationMaxY, 5);

  return {
    title: "Title",
    address: `${locationPointX} ${locationPointY}`,
    price: getRandomValue(100, 10000),
    type: getRandomArrayElement(types),
    rooms: getRandomValue(1, 8),
    guests: getRandomValue(1, 120),
    checking: getRandomArrayElement(checking),
    checkout: getRandomArrayElement(checkout),
    features: getRandomArraySubset(features),
    description: "Description",
    photos: getRandomArraySubset(photos),
    location: { x: locationPointX, y: locationPointY },
  };
}

module.exports = generateOffers;
