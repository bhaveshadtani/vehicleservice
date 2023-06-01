require('dotenv').config();
const express = require('express');
const { check, body } = require('express-validator');
const Customer = require('../../models/customer.models');

const customerController = require('../../controllers/admin/customer.controller');
const paymentController = require('../../controllers/admin/payment.controller');
const isAuth = require('../../middleware/admin/isAuth.middleware');

const router = express.Router();
/* GET home page. */
router.get('/', isAuth, customerController.getDashboard);

router.get('/display', isAuth, customerController.getDisplay);
router.get('/displayServices', isAuth, customerController.getDisplayServices);

/*Customer*/
router.get('/addCustomer', isAuth, customerController.getAddCustomer);
router.post('/addCustomer', isAuth,
    check('name', 'Name should not be empty')
        .notEmpty(),
    check('email', 'Please enter a valid email')
        .isEmail()
        .notEmpty()
        .custom(async (value, { req }) => {
            const customerData = await Customer.findOne({ email: value.toLowerCase() })
            if (customerData) {
                return Promise.reject('Email already exists, please pick a different one.');
            }
        }),
    body('password', 'Password Length must be 8 digit.')
        .isAlphanumeric()
        .isLength({ min: 8 })
        .notEmpty()
        .trim(),
    body('confirm_password')
        .notEmpty()
        .custom((value, { req }) => {
            if (value != req.body.password) {
                throw new Error('Confirm password does not match with password')
            }
            return true;
        })
        .trim(),
    check('dob', 'Please enter date of birth')
        .isDate()
        .notEmpty(),
    check('phone_no', "Phone Number must be in numeric and 10 digit only")
        .isLength({ min: 10, max: 10 })
        .isNumeric()
        .notEmpty(),
    check('city', 'City should not be empty')
        .notEmpty()
    , customerController.postAddCustomer);

router.get('/updateCustomer', isAuth, customerController.getUpdateCustomer);
router.post('/updateCustomer', isAuth,
    check('name', 'Name should not be empty')
        .notEmpty(),
    check('email', 'Please enter a valid email')
        .isEmail()
        .notEmpty(),
    check('phone_no', "Phone Number must be in numeric and 10 digit only")
        .isLength({ min: 10, max: 10 })
        .isNumeric()
        .notEmpty(),
    check('city', 'City should not be empty')
        .notEmpty(), customerController.postUpdateCustomer);

router.get('/deleteCustomer', isAuth, customerController.getDeleteCustomer);

/*Service*/
router.get('/addServices', isAuth, customerController.getAddServices);
router.post('/addServices', isAuth, customerController.postAddServices);

router.get('/updateServices', isAuth, customerController.getUpdateServices);
router.post('/updateServices', isAuth, customerController.postUpdateServices);

router.get('/deleteService', isAuth, customerController.getDeleteServices);

module.exports = router;
