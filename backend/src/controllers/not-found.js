const { response } = require('../utils');

const postNotFoundHandler = (req, res) => {
  res.end(response(null, 'Invalid route'));
};

module.exports = {
  postNotFoundHandler,
};
