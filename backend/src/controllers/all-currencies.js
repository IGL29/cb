const { response } = require('../utils');
const { KNOWN_CURRENCY_CODES } = require('../data/currency');

const getAllCurrenciesHandler = (req, res) => {
  res.end(response(KNOWN_CURRENCY_CODES));
};

module.exports = {
  getAllCurrenciesHandler,
};
