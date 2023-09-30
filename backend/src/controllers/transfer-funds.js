const { response, readData, makeAccount, writeData } = require('../utils');

const postTransferFundsHandler = async (req, res) => {
  const data = await readData();
  const { from, to, amount: rawAmount } = req.body || {};
  const fromAccount = data.accounts[from];
  let toAccount = data.accounts[to];
  const amount = Number(rawAmount);

  if (!fromAccount || !fromAccount.mine) {
    res.end(response(null, 'Invalid account from'));
    return;
  }

  if (!toAccount) {
    if (Math.random() < 0.25) {
      toAccount = makeAccount(false, toAccount);
      data.accounts[to] = toAccount;
    } else {
      res.end(response(null, 'Invalid account to'));
      return;
    }
  }

  if (isNaN(amount) || amount < 0) {
    res.end(response(null, 'Invalid amount'));
    return;
  }

  if (fromAccount.balance - amount < 0) {
    res.end(response(null, 'Overdraft prevented'));
    return;
  }

  fromAccount.balance -= amount;
  toAccount.balance += amount;

  const transactionTime = new Date().toISOString();
  fromAccount.transactions.push({
    date: transactionTime,
    from: fromAccount.account,
    to: toAccount.account,
    amount,
  });
  toAccount.transactions.push({
    date: transactionTime,
    from: fromAccount.account,
    to: toAccount.account,
    amount,
  });

  await writeData(data);

  res.end(response(fromAccount));
};

module.exports = {
  postTransferFundsHandler,
};
