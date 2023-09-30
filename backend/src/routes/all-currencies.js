const express = require('express');
const { getAllCurrenciesHandler } = require('../controllers/all-currencies');

const router = express.Router();

router.get('/', getAllCurrenciesHandler);

module.exports = router;
