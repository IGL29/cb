const express = require('express');
const { getCurrenciesHandler } = require('../controllers/currencies');

const router = express.Router();

router.get('/', getCurrenciesHandler);

module.exports = router;
