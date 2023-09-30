const express = require('express');
const { postTransferFundsHandler } = require('../controllers/transfer-funds');

const router = express.Router();

router.post('/', postTransferFundsHandler);

module.exports = router;
