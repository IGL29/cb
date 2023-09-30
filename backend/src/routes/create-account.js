const express = require('express');
const { postCreateAccountHandler } = require('../controllers/create-account');

const router = express.Router();

router.post('/', postCreateAccountHandler);

module.exports = router;
