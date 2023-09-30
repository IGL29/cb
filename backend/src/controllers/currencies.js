const { response, readData } = require('../utils');

const getCurrenciesHandler = async (req, res) => {
  const data = await readData();
  const myCurrencies = data.mine.currencies || {};
  res.end(response(myCurrencies));
};

module.exports = {
  getCurrenciesHandler,
};
