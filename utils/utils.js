function getRandomValue(min, max, decimals = 0) {
  const randomValue = Math.random() * (max - min) + min;
  return decimals > 0
    ? parseFloat(randomValue.toFixed(decimals))
    : Math.round(randomValue);
}

function getRandomArrayElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomArraySubset(array) {
  const length = getRandomValue(1, array.length);
  const shuffledArray = array.slice().sort(() => Math.random() - 0.5);
  return shuffledArray.slice(0, length);
}

module.exports = {
  getRandomValue,
  getRandomArrayElement,
  getRandomArraySubset,
};
