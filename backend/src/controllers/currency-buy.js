const { response, readData, writeData } = require('../utils');
const { getExchangeRate } = require('../services/rate');
const { KNOWN_CURRENCY_CODES } = require('../data/currency');

const postCurrencyBuyHandler = async (req, res) => {
  const { from, to, amount: rawAmount } = req.body || {};
  const data = await readData();
  const myCurrencies = data.mine.currencies || {};

  const amount = Number(rawAmount);

  if (
    !KNOWN_CURRENCY_CODES.includes(from) ||
    !KNOWN_CURRENCY_CODES.includes(to)
  ) {
    res.end(response(null, 'Unknown currency code'));
    return;
  }

  if (isNaN(amount) || amount < 0) {
    res.end(response(null, 'Invalid amount'));
    return;
  }

  const fromCurrency = myCurrencies[from];
  const toCurrency = (myCurrencies[to] = myCurrencies[to] || {
    amount: 0,
    code: to,
  });

  if (!fromCurrency || !fromCurrency.amount) {
    res.end(response(null, 'Not enough currency'));
    return;
  }

  const exchangeRate = (await getExchangeRate(from, to)) || 1;

  if (fromCurrency.amount - amount < 0) {
    res.end(response(null, 'Overdraft prevented'));
    return;
  }

  fromCurrency.amount -= amount;
  toCurrency.amount += amount * exchangeRate;

  await writeData(data);

  res.end(response(myCurrencies));
};

module.exports = {
  postCurrencyBuyHandler,
};
