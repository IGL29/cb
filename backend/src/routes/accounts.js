const express = require('express');
const { getAccountsHandler } = require('../controllers/accounts');

const router = express.Router();

router.get('/', getAccountsHandler);

module.exports = router;
