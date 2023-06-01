require('dotenv').config();

const express = require('express');
const router = express.Router();

const customerController = require('../../controllers/admin/customer.controller');
const paymentController = require('../../controllers/admin/payment.controller');
const isAuth = require('../../middleware/admin/isAuth.middleware');

const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const stripe = require('stripe')(SECRET_KEY)


router.get('/billing', isAuth, paymentController.getBilling);
router.post('/billing', isAuth, paymentController.postBilling);

router.get('/addCard', isAuth, paymentController.getAddCard);
router.post('/addCard', isAuth, paymentController.postAddCard);

router.post('/checkout', isAuth, paymentController.postCheckout);

router.get('/checkoutSuccess', isAuth, paymentController.getCheckoutSuccess);


module.exports = router;
