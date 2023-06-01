const Customer = require('../../models/customer.models');
const User = require('../../models/user.models');
const Service = require('../../models/service.models');

const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const stripe = require('stripe')(SECRET_KEY)

exports.getBilling = async (req, res, next) => {
    const cust_id = req.query.cust_id;
    try {
        const result = await stripe.paymentMethods.list({ customer: stripeCustomerId, type: 'card' });
        res.render('admin/billing', {
            userName: userName,
            role: role,
            result: result,
            cust_id: cust_id,
            path: '/billing',
            pageTitle: 'Billing'
        });
    }
    catch (error) {
        console.log(error)
    }
}

exports.postBilling = async (req, res, next) => {
    const { cust_id, card_paymentId } = req.body;
    try {
        const serviceData = await Service.find({ customerId: cust_id, payment_status: 'Unpaid' }).populate('customerId')
        res.render('admin/checkout', {
            userName: userName,
            role: role,
            cust_id: cust_id,
            card_paymentId: card_paymentId,
            serviceData: serviceData,
            customerData: serviceData[0],
            path: '/billing',
            pageTitle: 'Billing'
        });
    }
    catch (error) {
        console.log(error)
    }
}

exports.postCheckout = async (req, res, next) => {
    try {
        const { cust_id, card_paymentId, totalAmount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100,
            currency: 'inr',
            payment_method_types: ['card'],
            // setup_future_usage: 'off_session',   
            customer: stripeCustomerId
        }, { stripeAccount: 'acct_1MgYGySAHzGaxVyt' });
        const paymentSuccess = await stripe.customers.retrieveSource(stripeCustomerId, card_paymentId)
        const paymentConfirm = await stripe.paymentIntents.confirm(paymentIntent.id, { payment_method: card_paymentId })
        console.log('checkout success');

        const result = await Service.find({ customerId: cust_id });
        result.forEach(async data => {
            data.payment_status = "Paid";
            const saveData = await data.save();
        });
        res.redirect('/admin/checkoutSuccess');
    }
    catch (error) {
        console.log(error)
    }
}

exports.getAddCard = async (req, res, next) => {
    try {
        res.render('admin/addCard', {
            userName: userName,
            role: role,
            msg:' ',
            path: '/billing',
            pageTitle: 'Add Card'
        });
    }
    catch (error) {
        console.log(error)
    }
}

exports.postAddCard = async (req, res, next) => {
    const { card_number, card_holder_name, month, year, cvv } = req.body;
    try {
        const param = {};
        param.card = {
            number: card_number,
            name: card_holder_name.toUpperCase(),
            exp_month: month,
            exp_year: year,
            cvc: cvv
        }
        const stripeToken = await stripe.tokens.create(param);
        const params = { source: stripeToken.id }
        const result = await stripe.customers.createSource(stripeCustomerId, params)
        console.log("Card added successfully");
        res.redirect('/admin/billing')
    }
    catch (error) {
        console.log(error)
        res.render('admin/addCard', {
            userName: userName,
            role: role,
            msg:'Invalid card details',
            path: '/billing',
            pageTitle: 'Add Card'
        });
    }
}

exports.getCheckoutSuccess = (req, res, next) => {
    try {
        res.render('admin/checkoutSuccess', {
            path: '/billing',
            pageTitle: 'Checkout Success',
        });
    }
    catch (error) {
        console.log(error)
    }
}