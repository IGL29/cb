const { readData, response } = require('../utils');

const getAccountsHandler = async (req, res) => {
  const data = await readData();
  const myAccounts = Object.values(data.accounts)
    .filter((account) => account.mine)
    .map((account) => ({
      ...account,
      transactions: [
        account.transactions[account.transactions.length - 1],
      ].filter(Boolean),
    }));
  res.end(response(myAccounts));
};

module.exports = {
  getAccountsHandler,
};
