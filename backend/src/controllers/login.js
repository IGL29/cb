const { response } = require('../utils');
const { AUTH_DATA } = require('../data/users');

const postLoginHandler = (req, res) => {
  const { login, password } = req.body || {};
  if (login === AUTH_DATA.login) {
    if (password === AUTH_DATA.password) {
      res.end(response({ token: AUTH_DATA.token }));
    } else {
      res.end(response(null, 'Invalid password'));
    }
    return;
  }

  res.end(response(null, 'No such user'));
};

module.exports = {
  postLoginHandler,
};
