const { readData, formatAmount } = require('../utils');

async function setExchangeRate(currency1, currency2, rate) {
  const data = await readData();
  const existingInverseRate = data.exchange[`${currency2}/${currency1}`];
  if (existingInverseRate) {
    data.exchange[`${currency2}/${currency1}`] = formatAmount(1 / rate);
    return;
  }
  data.exchange[`${currency1}/${currency2}`] = rate;
}

async function getExchangeRate(currency1, currency2) {
  const data = await readData();
  const straightRate = Number(data.exchange[`${currency1}/${currency2}`]);
  if (!isNaN(straightRate)) {
    return straightRate;
  }
  const inverseRate = data.exchange[`${currency2}/${currency1}`];
  if (inverseRate) {
    return 1 / inverseRate;
  }
  return 0;
}

module.exports = {
  setExchangeRate,
  getExchangeRate,
};
