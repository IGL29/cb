const express = require('express');
const authCheck = require('../middlewares/authCheck');
const rootRouter = require('./root');
const loginRouter = require('./login');
const banksRouter = require('./banks');
const accountRouter = require('./account');
const accountsRouter = require('./accounts');
const notFoundRouter = require('./not-found');
const currenciesRouter = require('./currencies');
const createAccountRouter = require('./create-account');
const currencyBuyRouter = require('./currency-buy');
const allCurrenciesRouter = require('./all-currencies');
const transferFundsRouter = require('./transfer-funds');
const currencyFeedRouter = require('./currency-feed');

const router = express.Router();

router.use('/', rootRouter);
router.use('/login', loginRouter);
router.use('/banks', banksRouter);
router.use('/create-account', authCheck, createAccountRouter);
router.use('/transfer-funds', authCheck, transferFundsRouter);
router.use('/account', authCheck, accountRouter);
router.use('/accounts', authCheck, accountsRouter);
router.use('/currencies', authCheck, currenciesRouter);
router.use('/all-currencies', allCurrenciesRouter);
router.use('/currency-buy', authCheck, currencyBuyRouter);
router.use('/currency-feed', currencyFeedRouter);
router.use('*', notFoundRouter);

module.exports = router;
