const express = require('express');
const { getAccountHandler } = require('../controllers/account');

const router = express.Router();

router.get('/:id', getAccountHandler);

module.exports = router;
