const { readData, writeData, response, makeAccount } = require('../utils');

const postCreateAccountHandler = async (req, res) => {
  const data = await readData();
  const newAccount = makeAccount(true);
  data.accounts[newAccount.account] = newAccount;
  await writeData(data);
  res.end(response(newAccount));
};

module.exports = {
  postCreateAccountHandler,
};
