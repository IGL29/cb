const { response } = require('../utils');
const { AUTH_DATA } = require('../data/users');

function authCheck(req, res, next) {
  if (req.headers.authorization !== `Basic ${AUTH_DATA.token}`) {
    res.end(response(null, 'Unauthorized'));
    return;
  }
  next();
}

module.exports = authCheck;
