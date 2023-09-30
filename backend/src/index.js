const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const {
  pregenerateMineCurrencies,
  premakeAccounts,
  pregenerateHistory,
} = require('./utils.js');

const app = express();
const expressWs = require('express-ws')(app);

require('dotenv').config({
  path: path.resolve(__dirname, `environments/.env.${process.env.NODE_ENV}`)
});

const { readData } = require('./utils');
const { KNOWN_CURRENCY_CODES } = require('./data/currency.js');
const { KNOWN_OTHER_ACCOUNTS, MINE_ACCOUNT } = require('./data/accounts.js');
const routes = require('./routes/index.js');

const { URL = 'http://localhost', PORT = 5000 } = process.env;

(async () => {
  const data = await readData();
  pregenerateMineCurrencies(data, KNOWN_CURRENCY_CODES);
  premakeAccounts(data, KNOWN_OTHER_ACCOUNTS);
  pregenerateHistory(data, [MINE_ACCOUNT], true);
})();

app.use(cors());
app.use(bodyParser.json());

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Example app listening at ${URL}:${PORT}`);
});
