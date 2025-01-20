const {
  getRandomValue,
  getRandomArrayElement,
  getRandomArraySubset,
} = require("../utils/utils");

const types = ["palace", "flat", "house", "bungalow"];
const checking = ["12:00", "13:00", "14:00"];
const checkout = ["12:00", "13:00", "14:00"];
const features = [
  "wifi",
  "dishwasher",
  "parking",
  "washer",
  "elevator",
  "conditioner",
];
const photos = [
  "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
  "http://o0.github.io/assets/images/tokyo/hotel3.jpg",
];

const locationMinX = 35.65;
const locationMinY = 139.7;
const locationMaxX = 35.7;
const locationMaxY = 139.8;

const countCreateObject = 45;

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
