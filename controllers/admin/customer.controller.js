require('dotenv').config();
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../../models/user.models');
const Customer = require('../../models/customer.models');
const Service = require('../../models/service.models');

const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const stripe = require('stripe')(SECRET_KEY)

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});
exports.getDashboard = async (req, res, next) => {
    try {
        let totalCustomerAmount = 0, totalService = 0;
        /*Super Admin Dashboard Role==0*/
        let totalAmount = 0, totalAdminServices = 0;
        const userCount = await User.count({ role: 1 })
        const customerData = await Customer.count()
        const serviceData = await Service.find()
        serviceData.forEach(element => {
            totalAdminServices = totalAdminServices + 1;
            totalAmount = totalAmount + element.service_price;
        });

        /*Admin Dashboard Role==1*/
        const totalCustomer = await Customer.find({ userId: userId }).count()

        /*Customer Dashboard Role==2*/
        const totalCustomerService = await Service.find({ customerId: userId })
        totalCustomerService.forEach(async totalCustSer => {
            totalService = totalService + 1;
            totalCustomerAmount = totalCustomerAmount + totalCustSer.service_price;
        })

        res.render('admin/dashboard', {
            userName: userName,
            role: role,
            userCount: userCount,
            customerData: customerData,
            totalAdminServices: totalAdminServices,
            totalAmount: totalAmount,
            totalService: totalService,
            totalCustomer: totalCustomer,
            totalCustomerService: totalCustomerService,
            totalCustomerAmount: totalCustomerAmount,
            path: '/dashboard',
            pageTitle: 'Dashboard'
        });
    }
    catch (error) {
        console.log(error)
    }
}

exports.getDisplay = async (req, res, next) => {
    try {
        if (role === 0) {
            const userData = await User.find({ superAdminId: userId, isDeleted: false });
            res.render('admin/display', {
                userName: userName,
                role: role,
                userData: userData,
                path: '/display',
                pageTitle: 'Display',
            });
        }
        if (role === 1) {
            const customerData = await Customer.find({ userId: userId, isDeleted: false });
            res.render('admin/display', {
                userName: userName,
                role: role,
                userData: [],
                customerData: customerData,
                path: '/display',
                pageTitle: 'Display',
            });
        }
        if (role === 2) {
            const serviceData = await Service.find({ customerId: userId, isDeleted: false }).populate('customerId');
            res.render('admin/displayServices', {
                userName: userName,
                role: role,
                serviceData: serviceData,
                cust_id: userId,
                super_user_id: '',
                path: '/display',
                pageTitle: 'Display Services'
            });
        }
    }
    catch (error) {
        console.log(error)
    }
}

exports.getAddCustomer = async (req, res, next) => {
    try {
        if (role === 0) {
            const super_user_id = req.query.user_id;
            res.render('admin/addCustomer', {
                userName: userName,
                role: role,
                path: '/display',
                pageTitle: 'Add Customer',
                oldValue: '',
                editing: false,
                super_user_id: super_user_id,
                validationErrors: []
            });
        }
        else {
            res.render('admin/addCustomer', {
                userName: userName,
                role: role,
                path: '/display',
                pageTitle: 'Add Customer',
                oldValue: '',
                editing: false,
                super_user_id: '',
                validationErrors: []
            });
        }
    }
    catch (error) {
        console.log(error)
    }
}

exports.postAddCustomer = async (req, res, next) => {
    const { name, email, password, dob, phone_no, city, super_user_id } = req.body;
    const image = req.file;
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const alert = errors.array()[0].msg;
            res.render('admin/addCustomer', {
                alert,
                path: '/display',
                pageTitle: 'Add Customer',
                oldValue: req.body,
                editing: false,
                super_user_id: super_user_id,
                validationErrors: errors.array()
            });
        }
        else {

            const customerData = await Customer.findOne({ email: email });
            const hashPassword = await bcrypt.hash(password, 12);


            if (role === 0) {
                let param = {};
                param.email = email;
                param.name = name;
                const result = await stripe.customers.create(param);
                const customer = await new Customer({
                    name: name,
                    email: email.toLowerCase(),
                    password: hashPassword,
                    dob: dob,
                    phone_no: phone_no,
                    city: city,
                    role: 2,
                    userId: super_user_id,
                    isDeleted: false,
                    userProfileImage: image.filename,
                    stripeCustomerId: result.id,
                    createdAt: Date.now()
                });
                const saveData = await customer.save();
                console.log("Customer Added Successfully By Super Admin");
                //Send Email
                const message = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Register',
                    html: `${name} has been successfully register.`
                };
                transporter.sendMail(message, (error, info) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent...', info.response);
                    }
                })
                res.redirect('/admin/display');
            }
            else {
                let param = {};
                param.email = email;
                param.name = name;
                const result = await stripe.customers.create(param);
                const customer = await new Customer({
                    name: name,
                    email: email.toLowerCase(),
                    password: hashPassword,
                    dob: dob,
                    phone_no: phone_no,
                    city: city,
                    role: 2,
                    userId: userId,
                    isDeleted: false,
                    userProfileImage: image.filename,
                    stripeCustomerId: result.id,
                    createdAt: Date.now()
                });
                const saveData = await customer.save();
                console.log("Customer Added Successfully By Admin");

                //Send Email
                const message = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Register',
                    html: `${name} has been successfully register.`
                };
                transporter.sendMail(message, (error, info) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent ...', info.response);
                    }
                })
                res.redirect('/admin/display');
            }
        }
    }
    catch (error) {
        console.log(error)
    }
}

exports.getAddServices = async (req, res, next) => {
    const cust_id = req.query.cust_id.trim();
    try {
        const customerData = await Customer.find({ _id: cust_id, isDeleted: false });
        res.render('admin/addServices', {
            userName: userName,
            role: role,
            customerData: customerData[0],
            path: '/addServices',
            pageTitle: 'Add Services'
        });
    }
    catch (error) {
        console.log(error)
    }
}

exports.postAddServices = async (req, res, next) => {
    const { cust_id,cust_email, vehicle_no, pickup_date, drop_date, location, service_location, service_price } = req.body;
    try {
        const service = await new Service({
            vehicle_no: vehicle_no,
            pickup_date: pickup_date,
            drop_date: drop_date,
            location: location,
            service_location: service_location,
            service_price: service_price,
            payment_status: "Unpaid",
            customerId: cust_id,
            isDeleted: false,
        });
        const result = await service.save();
        console.log("Service Added Successfully.");
        const message = {
            from: process.env.EMAIL,
            to: cust_email,
            subject: 'Service ',
            html: `<h2>Your Service Successfully Added. Thank You</h2><hr>
                    <h3><b>Service Details :</b> </h3>
                    <p>Email : ${cust_email} </p>
                    <p>Vehicle No : ${vehicle_no} </p>
                    <p>Pickup Date : ${pickup_date} </p>
                    <p>Drop Date : ${drop_date} </p>
                    <p>Location : ${location} </p>
                    <p>Service Location: ${service_location} </p>
                    <p>Service Price: ${service_price} </p><hr>
                    <p>Thank you for your support.</p>`
        };
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log('Email sent ...', info.response)
            }
        })
        res.redirect('/admin/display');
    }
    catch (error) {
        console.log(error)
    }
}

exports.getDisplayServices = async (req, res, next) => {
    const cust_id = req.query.cust_id;
    try {
        const serviceData = await Service.find({ customerId: cust_id, isDeleted: false }).populate('customerId');
        res.render('admin/displayServices', {
            userName: userName,
            role: role,
            serviceData: serviceData,
            cust_id: cust_id,
            super_user_id: '',
            path: '/display',
            pageTitle: 'Display Services'
        });
    }
    catch (error) {
        console.log(error)
    }
}

exports.getUpdateCustomer = async (req, res, next) => {
    const cust_id = req.query.cust_id;
    const editMode = Boolean(req.query.editMode);
    try {
        if (!editMode) {
            res.redirect('/admin/display')
        }
        else {
            const customerData = await Customer.find({ _id: cust_id });
            res.render('admin/addCustomer', {
                userName: userName,
                role: role,
                customerData: customerData[0],
                path: '/display',
                pageTitle: 'Edit Customer',
                editing: editMode,
                oldValue: req.body,
                cust_id: cust_id,
                super_user_id: '',
                validationErrors: []
            });
        }
    }
    catch (error) {
        console.log(error)
    }
}

exports.postUpdateCustomer = async (req, res, next) => {
    const { name, email, dob, phone_no, city, cust_id } = req.body;
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const customerData = await Customer.find({ _id: cust_id });
            const alert = errors.array()[0].msg;
            res.render('admin/addCustomer', {
                alert,
                path: '/display',
                pageTitle: 'Edit Customer',
                customerData: [],
                oldValue: req.body,
                editing: true,
                cust_id: cust_id,
                super_user_id: '',
                validationErrors: errors.array()
            });
        }
        const result = await Customer.findByIdAndUpdate({ _id: cust_id });
        result.name = name;
        result.email = email;
        result.dob = dob;
        result.phone_no = phone_no;
        result.city = city;
        const saveData = await result.save();
        console.log("Customer Updated")
        res.redirect('/admin/display')
    }
    catch (error) {
        console.log(error)
    }
}

exports.getDeleteCustomer = async (req, res, next) => {
    const cust_id = req.query.cust_id;

    try {
        const customerData = await Customer.findByIdAndUpdate({ _id: cust_id });
        customerData.isDeleted = true;
        const saveData = customerData.save();
        console.log("Customer Deleted Successfully");
        res.redirect('/admin/display')
    }
    catch (error) {
        console.log(error)
    }
}

exports.getUpdateServices = async (req, res, next) => {
    const service_id = req.query.service_id;
    try {
        const servicesData = await Service.find({ _id: service_id }).populate('customerId');
        res.render('admin/updateServices', {
            userName: userName,
            role: role,
            servicesData: servicesData[0],
            customerData: servicesData,
            path: '/addServices',
            pageTitle: 'Update Services'
        });
    }
    catch (error) {
        console.log(error)
    }
}

exports.postUpdateServices = async (req, res, next) => {
    const { customerId, vehicle_no, pickup_date, drop_date, location, service_location, service_price, service_id } = req.body;
    try {
        const result = await Service.findByIdAndUpdate({ _id: service_id });
        result.vehicle_no = vehicle_no;
        result.pickup_date = pickup_date;
        result.drop_date = drop_date;
        result.location = location;
        result.service_location = service_location;
        result.service_price = service_price;
        result.customerId = customerId;
        const saveData = await result.save();
        console.log("Service Updated")
        res.redirect('/admin/display');
    }
    catch (error) {
        console.log(error)
    }
}

exports.getDeleteServices = async (req, res, next) => {
    const service_id = req.query.service_id;

    try {
        const serviceData = await Service.findByIdAndUpdate({ _id: service_id });
        serviceData.isDeleted = true;
        const saveData = serviceData.save();
        console.log("Service Deleted Successfully");
        res.redirect('/admin/display')
    }
    catch (error) {
        console.log(error)
    }
}