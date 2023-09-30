const { writeData, formatAmount } = require('../utils');
const { KNOWN_CURRENCY_CODES } = require('../data/currency');
const { setExchangeRate, getExchangeRate } = require('../services/rate');
const { readData } = require('../utils');

let currencyFeedSubscribers = [];

const wsCurrencyFeedHandler = (ws, req) => {
  currencyFeedSubscribers.push(ws);
  ws.on('close', () => {
    currencyFeedSubscribers = currencyFeedSubscribers.filter(
      (websocket) => websocket !== ws
    );
  });
};

const currencyRateFeedGenerator = setInterval(async () => {
  const currenciesLength = KNOWN_CURRENCY_CODES.length;
  const index1 = Math.floor(Math.random() * currenciesLength);
  let index2 = Math.floor(Math.random() * currenciesLength);
  if (index1 === index2) {
    index2 = (index2 + 1) % currenciesLength;
  }
  const from = KNOWN_CURRENCY_CODES[index1];
  const to = KNOWN_CURRENCY_CODES[index2];
  const rate = formatAmount(0.001 + Math.random() * 100);
  const previousExchangeRate = await getExchangeRate(from, to);
  const change =
    rate > previousExchangeRate ? 1 : rate < previousExchangeRate ? -1 : 0;

  await setExchangeRate(from, to, rate);
  const data = await readData();
  await writeData(data);
  currencyFeedSubscribers.forEach((subscriber) =>
    subscriber.send(
      JSON.stringify({
        type: 'EXCHANGE_RATE_CHANGE',
        from,
        to,
        rate,
        change,
      })
    )
  );
}, 1000);
currencyRateFeedGenerator.unref();

module.exports = {
  wsCurrencyFeedHandler,
};
