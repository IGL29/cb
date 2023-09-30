const { response } = require('../utils');
const { POINTS_LIST } = require('../data/points');

const getBanksHandler = (req, res) => {
  res.end(response(POINTS_LIST));
};

module.exports = {
  getBanksHandler,
};
