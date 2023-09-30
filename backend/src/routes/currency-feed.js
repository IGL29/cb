const express = require('express');
const { wsCurrencyFeedHandler } = require('../controllers/currency-feed');

const router = express.Router();

router.ws('/', wsCurrencyFeedHandler);

module.exports = router;
