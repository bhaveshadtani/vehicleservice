require('dotenv').config();
const jwt = require('jsonwebtoken');
const { isJwtExpired } = require('jwt-check-expiration');
const User = require('../../models/user.models');
const Customer = require('../../models/customer.models');

const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token;
    const expiredToken = isJwtExpired(token);
    try {
        if (!expiredToken) {
            if (token) {
                const bearerToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
                if (bearerToken) {
                    const customer = await Customer.findOne({ email: bearerToken.userEmail });
                    if (customer != null) {
                        email = customer.email;
                        userName = customer.name;
                        role = customer.role;
                        userId = customer._id;
                        stripeCustomerId = customer.stripeCustomerId;
                        next();
                    }
                    else {
                        const user = await User.findOne({ email: bearerToken.userEmail });
                        if (user) {
                            email = user.email;
                            userName = user.name;
                            role = user.role;
                            userId = user._id;
                            stripeCustomerId = user.stripeCustomerId;
                            next();
                        }
                    }
                }
                else {
                    res.redirect('/admin/login');
                }
            }
            else {
                res.redirect('/admin/login');
            }
        }
        else {
            res.clearCookie("token");
            res.redirect('/admin/login')
        }
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = authenticateToken;
