const { readData, response } = require('../utils');

const getAccountHandler = async (req, res) => {
  const data = await readData();
  const myAccount = data.accounts[req.params.id];
  if (myAccount) {
    res.end(response(myAccount));
    return;
  }
  res.end(response(null, 'No such account'));
};

module.exports = {
  getAccountHandler,
};
