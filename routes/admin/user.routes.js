const express = require('express');
const { check, body } = require('express-validator');
const User = require('../../models/user.models');
const Customer = require('../../models/customer.models');
const Mechanic = require('../../models/mechanic.model');


const userController = require('../../controllers/admin/user.controller');
const paymentController = require('../../controllers/admin/payment.controller');

const isAuth = require('../../middleware/admin/isAuth.middleware');

const router = express.Router();

/*Sign UP*/
router.get('/signup', userController.getSignup);
router.post('/signup',
    check('name', 'Name should not be empty')
        .notEmpty(),
    check('email', 'Please enter a valid email')
        .isEmail()
        .notEmpty()
        .custom(async (value, { req }) => {
            const userData = await User.findOne({ email: value.toLowerCase() })
            if (userData) {
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
    check('phone_no', "Phone Number must be in numeric and 10 digit only")
        .isLength({ min: 10, max: 10 })
        .isNumeric()
        .notEmpty(),
    check('city', 'City should not be empty')
        .notEmpty()
    , userController.postSignup);

/*Login*/
router.get('/login', userController.getLogin);
router.post('/login',
    check('email', 'Please enter a valid email')
        .isEmail()
        .notEmpty()
        .custom(async (value, { req }) => {
            const { speedLogin } = req.body;
            switch (speedLogin) {
                case 'Admin':
                    const userData = await User.findOne({ email: value })
                    if (!userData) {
                        return Promise.reject('Email does not exist');
                    }
                    break;
                case 'Mechanic':
                    const mechanicData = await Mechanic.findOne({ email: value })
                    if (!mechanicData) {
                        return Promise.reject('Email does not exist');
                    }
                    break;
                case 'Customer':
                    const customerData = await Customer.findOne({ email: value })
                    if (!customerData) {
                        return Promise.reject('Email does not exist');
                    }
                    break;
                default:
                    return Promise.reject('Email does not exist');

            }
        })
        .normalizeEmail(),
    check('password', 'Password Length must be 8 digit')
        .notEmpty()
        .isLength({ min: 8 })
        .trim(), userController.postLogin);

/*OTP*/
router.get('/otp', isAuth, userController.getOtp);
router.post('/otp', isAuth, userController.postOtp);

/*Forget Password Sent Mail*/
router.get('/sendEmail', userController.getResetEmail);
router.post('/sendEmail',
    check('email')
        .isEmail()
        .notEmpty()
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(result => {
                    if (!result) {
                        return Promise.reject('Email does not exist');
                    }
                })
        })
        .normalizeEmail(),
    userController.postResetEmail);

/*Forget Password*/
router.get('/forgetPassword/:resetId', userController.getForgetPassword);
router.post('/forgetPassword',
    body('password', 'Password Length must be 8 digit.')
        .isAlphanumeric()
        .isLength({ min: 8 })
        .notEmpty()
        .trim(),
    body('confirm_password')
        .notEmpty()
        .custom((value, { req }) => {
            if (value != req.body.password) {
                console.log("🚀 ~ file: user.routes.js:122 ~ .custom ~ req.body.password:", req.body.password)
                throw new Error('Confirm password does not match with password')
            }
            return true;
        })
        .trim(), userController.postForgetPassword);

/*Logout*/
router.get('/logout', isAuth, userController.getLogout);

/*Add User*/
router.get('/addUser', isAuth, userController.getAddUser);
router.post('/addUser', isAuth,
    check('name', 'Name should not be empty')
        .notEmpty(),
    check('email', 'Please enter a valid email')
        .isEmail()
        .notEmpty()
        .custom(async (value, { req }) => {
            const userData = await User.findOne({ email: value })
            if (userData) {
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
    check('phone_no', "Phone Number must be in numeric and 10 digit only")
        .isLength({ min: 10, max: 10 })
        .isNumeric()
        .notEmpty(),
    check('city', 'City should not be empty')
        .notEmpty()
    , userController.postAddUser);

/*Display Customer*/
router.get('/displayCustomer', isAuth, userController.getDisplayCustomer);

/*Delete User*/
router.get('/deleteUser', isAuth, userController.getDeleteuser);

/*Update User*/
router.get('/updateUser', isAuth, userController.getUpdateUser);
router.post('/updateUser', isAuth, userController.postUpdateUser);

/*Add Car Details*/
router.get('/addCarDetails', isAuth, userController.getAddCarDetails);
router.post('/addCarDetails', isAuth, userController.postAddCarDetails);

router.get('/displayCarDetails', isAuth, userController.getDisplayCarDetails);
router.get('/displayCarModels', isAuth, userController.getDisplayCarModels);
router.get('/displayCarFuels', isAuth, userController.getDisplayCarFuels);

/* Add Service Details*/
router.get('/displayServiceDetails', isAuth, userController.getDisplayServiceDetails);
router.get('/addServiceDetails', isAuth, userController.getAddServiceDetails);
router.post('/addServiceDetails', isAuth, userController.postAddServiceDetails);

module.exports = router;
