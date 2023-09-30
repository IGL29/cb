const express = require('express');
const { postCurrencyBuyHandler } = require('../controllers/currency-buy');

const router = express.Router();

router.post('/', postCurrencyBuyHandler);

module.exports = router;
