require("dotenv").config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const User = require("../../models/user.models");
const Customer = require("../../models/customer.models");
const Mechanic = require("../../models/mechanic.model");
const OTP = require("../../models/otp.models");
const Manufacturer = require("../../models/carBrand.model");
const Car = require("../../models/carModel.model");
const Fuel = require("../../models/carFuel.model");
const ServiceDetail = require("../../models/serviceDetail.model");

const PUBLISHABLE_KEY = process.env.PUBLISHABLE_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const stripe = require("stripe")(SECRET_KEY);

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

exports.getLogin = async (req, res, next) => {
  try {
    res.render("admin/login", {
      path: "/login",
      pageTitle: "Login",
      oldValue: "",
      msg: "",
      validationErrors: [],
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password, speedLogin } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const alert = errors.array()[0].msg;
      res.render("admin/login", {
        alert,
        msg: "",
        path: "/login",
        pageTitle: "Login",
        oldValue: req.body,
        validationErrors: errors.array(),
      });
    } else {
      switch (speedLogin) {
        case "Admin":
          const userData = await User.findOne({
            email: email,
            isDeleted: false,
          });
          const adminMatch = await bcrypt.compare(password, userData.password);
          if (adminMatch) {
            let generateOtp = Math.floor(1000 + Math.random() * 9000);
            console.log("🚀 ~ file: user.controller.js:68 ~ exports.postLogin= ~ generateOtp:", generateOtp);
            const token = jwt.sign(
              { userEmail: userData.email },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "4h" }
            );
            res.cookie("token", token, { httpOnly: true });
            // res.cookie('verifyToken', token, { httpOnly: true });
            //Send Email
            const message = {
              from: process.env.EMAIL,
              to: email,
              subject: "OTP",
              html: `Hey ${userData.name}!,<br/><br/>

A sign in attempt requires further verification because we did not recognize your device. To complete the sign in, enter the verification code on the unrecognized device.

<br/>Verification code:  <b>${generateOtp}</b>
<br/>Please note that this verification code will expire in 5 minutes. If you do not enter your verification code  within this time frame, you will need to request a new verification code.
<br/>If you have any questions or concerns, please contact our customer support team.
<br/><br/>
Thanks,<br/>
Vehicleservice Team`,
            };
            transporter.sendMail(message, (error, info) => {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent ...", info.response);
              }
            });
            //OTP Store
            const hasedOtp = await bcrypt.hash(String(generateOtp), 10);
            const otpModel = new OTP({
              userId: userData._id,
              otp: hasedOtp,
            });
            const savedOtp = await OTP.findOneAndDelete({
              userId: userData._id,
            });
            otpModel.save();
            res.redirect("/admin/otp");
          } else {
            res.render("admin/login", {
              msg: "Invalid Password",
              path: "/login",
              pageTitle: "Login",
              oldValue: req.body,
              validationErrors: [],
            });
          }
          break;

        case "Mechanic":
          const mechanicData = await Mechanic.findOne({
            email: email,
            isDeleted: false,
          });
          const mechanicMatch = await bcrypt.compare(
            password,
            mechanicData.password
          );
          if (mechanicMatch) {
            let generateOtp = Math.floor(1000 + Math.random() * 9000);
            console.log("🚀 ~ file: user.controller.js:68 ~ exports.postLogin= ~ generateOtp:", generateOtp);
            const token = jwt.sign(
              { userEmail: mechanicData.email },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "4h" }
            );
            res.cookie("token", token, { httpOnly: true });
            //Send Email
            const message = {
              from: process.env.EMAIL,
              to: email,
              subject: "OTP",
              html: `Hey ${mechanicData.name}!,<br/><br/>

A sign in attempt requires further verification because we did not recognize your device. To complete the sign in, enter the verification code on the unrecognized device.

<br/>Verification code:  <b>${generateOtp}</b>
<br/>Please note that this verification code will expire in 5 minutes. If you do not enter your verification code  within this time frame, you will need to request a new verification code.
<br/>If you have any questions or concerns, please contact our customer support team.
<br/><br/>
Thanks,<br/>
Vehicleservice Team`,
            };
            transporter.sendMail(message, (error, info) => {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent ...", info.response);
              }
            });
            //OTP Store
            const hasedOtp = await bcrypt.hash(String(generateOtp), 10);
            const otpModel = new OTP({
              userId: mechanicData._id,
              otp: hasedOtp,
            });
            const savedOtp = await OTP.findOneAndDelete({
              userId: customerData._id,
            });
            otpModel.save();
            res.redirect("/admin/otp");
          } else {
            res.render("admin/login", {
              msg: "Invalid Password",
              path: "/login",
              pageTitle: "Login",
              oldValue: req.body,
              validationErrors: [],
            });
          }
          break;

        case "Customer":
          const customerData = await Customer.findOne({
            email: email,
            isDeleted: false,
          });
          const customerMatch = await bcrypt.compare(
            password,
            customerData.password
          );
          if (customerMatch) {
            let generateOtp = Math.floor(1000 + Math.random() * 9000);
            console.log("🚀 ~ file: user.controller.js:68 ~ exports.postLogin= ~ generateOtp:", generateOtp);

            const token = jwt.sign(
              { userEmail: customerData.email },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "4h" }
            );
            res.cookie("token", token, { httpOnly: true });
            //Send Email
            const message = {
              from: process.env.EMAIL,
              to: email,
              subject: "OTP",
              html: `Hey ${customerData.name}!,<br/><br/>

A sign in attempt requires further verification because we did not recognize your device. To complete the sign in, enter the verification code on the unrecognized device.

<br/>Verification code:  <b>${generateOtp}</b>
<br/>Please note that this verification code will expire in 5 minutes. If you do not enter your verification code  within this time frame, you will need to request a new verification code.
<br/>If you have any questions or concerns, please contact our customer support team.
<br/><br/>
Thanks,<br/>
Vehicleservice Team`,
            };
            transporter.sendMail(message, (error, info) => {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent ...", info.response);
              }
            });

            //OTP Store
            const hasedOtp = await bcrypt.hash(String(generateOtp), 10);
            const otpModel = new OTP({
              userId: customerData._id,
              otp: hasedOtp,
            });
            const savedOtp = await OTP.findOneAndDelete({
              userId: customerData._id,
            });
            otpModel.save();
            res.redirect("/admin/otp");
          } else {
            res.render("admin/login", {
              msg: "Invalid Password",
              path: "/login",
              pageTitle: "Login",
              oldValue: req.body,
              validationErrors: [],
            });
          }
          break;
        default:
          console.log("Email does not exist");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getOtp = async (req, res, next) => {
  try {
    res.render("admin/otp", {
      msg: "",
      path: "/otp",
      pageTitle: "OTP",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postOtp = async (req, res, next) => {
  const otp = String(req.body.otp);

  const otps = await OTP.findOne({ userId: userId });

  if (!otps) {
    console.log("otp is expired");
    res.redirect("/admin/login");
  } else {
    const match = await bcrypt.compare(otp, otps.otp);
    if (match) {
      const result = await OTP.findOneAndDelete({ userId });
      res.redirect("/admin/");
    } else {
      res.render("admin/otp", {
        msg: "OTP is not correct",
        path: "/otp",
        pageTitle: "OTP",
      });
    }
  }
};

exports.getResetEmail = async (req, res, next) => {
  try {
    res.render("admin/sendEmail", {
      path: "/sendEmail",
      pageTitle: "Sent Email",
      validationErrors: [],
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postResetEmail = async (req, res, next) => {
  const { email } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const alert = errors.array()[0].msg;
      res.render("admin/sendEmail", {
        alert,
        path: "/sendEmail",
        pageTitle: "Sent Email",
        validationErrors: errors.array(),
      });
    } else {
      const customerData = await Customer.findOne({ email: email });
      const userData = await User.findOne({ email: email });
      const mechanicData = await Mechanic.findOne({ email: email });

      if (userData) {
        if (!userData) {
          res.redirect("/admin/login");
        } else {
          const message = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset",
            html: `
            Hey ${userData.name}!,<br/><br/>
            We have received a request to reset your password for your account associated with ${email}. If you did not request this change, please ignore this email.
            <br/>To reset your password, please click on the following link: <a href='https://www.agphotography.cf/admin/forgetPassword/${userData._id}'>Reset Password</a>. You will be prompted to enter a new password.
            <br/>Please note that this link will expire in 24 hours. If you do not reset your password within this time frame, you will need to request a new password reset link.
            <br/>If you have any questions or concerns, please contact our customer support team.
            <br/><br/>
            Thanks,<br/>
            Vehicleservice Team
            `
          };
          transporter.sendMail(message, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent ...", info.response);
            }
          });
          res.redirect("/admin/login");
        }
      }
      if (customerData) {
        if (!customerData) {
          res.redirect("/admin/login");
        } else {
          const message = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset",
            html: `
            Hey ${customerData.name}!,<br/><br/>
            We have received a request to reset your password for your account associated with ${email}. If you did not request this change, please ignore this email.
            <br/>To reset your password, please click on the following link: <a href='https://www.agphotography.cf/admin/forgetPassword/${customerData._id}'>Reset Password</a>. You will be prompted to enter a new password.
            <br/>Please note that this link will expire in 24 hours. If you do not reset your password within this time frame, you will need to request a new password reset link.
            <br/>If you have any questions or concerns, please contact our customer support team.
            <br/><br/>
            Thanks,<br/>
            Vehicleservice Team
            `,
          };
          transporter.sendMail(message, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent ...", info.response);
            }
          });
          res.redirect("/admin/login");
        }
      }
      if (mechanicData) {
        if (!mechanicData) {
          res.redirect("/admin/login");
        } else {
          const message = {
            from: process.env.EMAIL,
            to: email,
            subject: "Password Reset",
            html: `
            Hey ${mechanicData.name}!,<br/><br/>
            We have received a request to reset your password for your account associated with ${email}. If you did not request this change, please ignore this email.
            <br/>To reset your password, please click on the following link: <a href='https://www.agphotography.cf/admin/forgetPassword/${mechanicData._id}'>Reset Password</a>. You will be prompted to enter a new password.
            <br/>Please note that this link will expire in 24 hours. If you do not reset your password within this time frame, you will need to request a new password reset link.
            <br/>If you have any questions or concerns, please contact our customer support team.
            <br/><br/>
            Thanks,<br/>
            Vehicleservice Team
            `,
          };
          transporter.sendMail(message, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent ...", info.response);
            }
          });
          res.redirect("/admin/login");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getForgetPassword = async (req, res, next) => {
  try {
    const resetId = req.params.resetId;
    res.render("admin/forgetPassword", {
      resetId: resetId,
      path: "/forgetPassword",
      pageTitle: "Forget Password",
      validationErrors: [],
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postForgetPassword = async (req, res, next) => {
  const { password, resetId } = req.body;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array()[0].msg;
      res.render("admin/forgetPassword", {
        alert,
        resetId: resetId,
        path: "/forgetPassword",
        pageTitle: "Forget Password",
        oldValue: req.body,
        validationErrors: errors.array(),
      });
    } else {
      const customerData = await Customer.findById(resetId);
      const userData = await User.findById(resetId);
      const mechanicData = await Mechanic.findById(resetId);
      if (userData) {
        const hashPassword = await bcrypt.hash(password, 12);
        const result = await User.findByIdAndUpdate({ _id: resetId });
        result.password = hashPassword;
        const savedData = await result.save();
        res.redirect("/admin/login");
      }
      if (customerData) {
        const hashPassword = await bcrypt.hash(password, 12);
        const result = await Customer.findByIdAndUpdate({ _id: resetId });
        result.password = hashPassword;
        const savedData = await result.save();
        res.redirect("/admin/login");
      }
      if (mechanicData) {
        const hashPassword = await bcrypt.hash(password, 12);
        const result = await Mechanic.findByIdAndUpdate({ _id: resetId });
        result.password = hashPassword;
        const savedData = await result.save();
        res.redirect("/admin/login");
      }
    }
  } catch (error) {
    console.log(err);
  }
};

exports.getSignup = async (req, res, next) => {
  try {
    res.render("admin/signup", {
      path: "/signup",
      pageTitle: "Sign up",
      oldValue: "",
      validationErrors: [],
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postSignup = async (req, res, next) => {
  const { name, email, password, dob, phone_no, city } = req.body;
  const image = req.file;

  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const alert = errors.array()[0].msg;
      res.render("admin/signup", {
        alert,
        path: "/signup",
        pageTitle: "Sign up",
        oldValue: req.body,
        validationErrors: errors.array(),
      });
    } else {
      const customerData = await Customer.findOne({ email: email });
      const hashPassword = await bcrypt.hash(password, 12);

      let param = {};
      param.email = email;
      param.name = name;
      const result = await stripe.customers.create(param);

      const customer = await new Customer({
        name: name,
        email: email,
        password: hashPassword,
        dob: dob,
        phone_no: phone_no,
        city: city,
        role: 2,
        isDeleted: false,
        userProfileImage: image.filename,
        userId: "64130727d0eb0977bad69034",
        stripeCustomerId: result.id,
        createdAt: Date.now(),
      });
      const savedData = await customer.save();
      console.log("Register Successfully");
      //Send Email
      const message = {
        from: process.env.EMAIL,
        to: email,
        subject: "Register",
        html: `${name} has successfully register.`,
      };
      transporter.sendMail(message, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent ...", info.response);
        }
      });
      res.redirect("/admin/login");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getLogout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.redirect("/admin/login");
  } catch (error) {
    console.log(error);
  }
};

exports.getAddUser = async (req, res, next) => {
  try {
    res.render("admin/addUser", {
      path: "/addUser",
      pageTitle: "Add User",
      oldValue: "",
      validationErrors: [],
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postAddUser = async (req, res, next) => {
  const { name, email, password, dob, phone_no, city } = req.body;
  const image = req.file;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {

      const alert = errors.array()[0].msg;
      res.render("admin/addUser", {
        alert,
        path: "/addUser",
        pageTitle: "Add User",
        oldValue: req.body,
        validationErrors: errors.array(),
      });
    } else {
      const userData = await User.findOne({ email: email });
      const hashPassword = await bcrypt.hash(password, 12);

      let param = {};
      param.email = email;
      param.name = name;
      const result = await stripe.customers.create(param);

      const user = await new User({
        name: name,
        email: email,
        password: hashPassword,
        dob: dob,
        phone_no: phone_no,
        city: city,
        role: 1,
        isDeleted: false,
        userProfileImage: image.filename,
        superAdminId: userId,
        stripeCustomerId: result.id,
        createdAt: Date.now(),
      });
      const saveData = await user.save();
      console.log("User Added Successfully");

      //Send Email
      const message = {
        from: process.env.EMAIL,
        to: email,
        subject: "Register",
        html: `${name} has successfully register.`,
      };
      transporter.sendMail(message, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent ...", info.response);
        }
      });
      res.redirect("/admin/display");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getDisplayCustomer = async (req, res, next) => {
  const user_id = req.query.user_id;
  try {
    const customerData = await Customer.find({
      userId: user_id,
      isDeleted: false,
    });
    res.render("admin/displayCustomer", {
      userName: userName,
      role: role,
      customerData: customerData,
      user_id: user_id,
      path: "/display",
      pageTitle: "Display Customer",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getDeleteuser = async (req, res, next) => {
  const user_id = req.query.user_id;

  try {
    const userData = await User.findByIdAndUpdate({ _id: user_id });
    userData.isDeleted = true;
    const saveData = userData.save();
    console.log("User Deleted Successfully");
    res.redirect("/admin/display");
  } catch (error) {
    console.log(error);
  }
};

exports.getUpdateUser = async (req, res, next) => {
  const user_id = req.query.user_id;
  const editMode = Boolean(req.query.editMode);
  try {
    const userData = await User.findById(user_id);
    res.render("admin/updateUser", {
      userName: userName,
      role: role,
      userData: userData,
      path: "/display",
      pageTitle: "Edit User",
      oldValue: req.body,
      user_id: user_id,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postUpdateUser = async (req, res, next) => {
  const { name, email, dob, phone_no, city, user_id } = req.body;
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const userData = await User.findById(user_id);
      const alert = errors.array()[0].msg;
      res.render("admin/updateUser", {
        alert,
        path: "/display",
        pageTitle: "Edit Customer",
        userData: [],
        oldValue: req.body,
        user_id: user_id,
        validationErrors: errors.array(),
      });
    }
    const result = await User.findByIdAndUpdate(user_id);
    result.name = name;
    result.email = email;
    result.dob = dob;
    result.phone_no = phone_no;
    result.city = city;
    const saveData = await result.save();
    console.log("User Updated");
    res.redirect("/admin/display");
  } catch (error) {
    console.log(error);
  }
};

exports.getAddCarDetails = async (req, res, next) => {
  const car_details = req.query.button;
  const brand_id = req.query.brand_id;
  const car_model_id = req.query.car_model_id;
  try {
    res.render("admin/addCarDetails", {
      path: "/displayCarDetails",
      car_details: car_details,
      brand_id: brand_id,
      car_model_id: car_model_id,
      pageTitle: "Add Car Details",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postAddCarDetails = async (req, res, next) => {
  try {
    const { button } = req.body;
    if (button == "Manufacturer") {
      const { brand_name } = req.body;
      const image = req.file;
      const manufacturer = await new Manufacturer({
        brandName: brand_name,
        brandImage: image.filename,
        isDeleted: false,
        createdAt: Date.now(),
      });
      const saveData = await manufacturer.save();
      console.log("Manufacturer added successfully");
      res.redirect("/admin/displayCarDetails");
    } else if (button == "Cars") {
      const { modelName, brand_id } = req.body;
      const image = req.file;
      const car = await new Car({
        modelName: modelName,
        modelImage: image.filename,
        brandId: brand_id,
        isDeleted: false,
        createdAt: Date.now(),
      });
      const saveData = await car.save();
      console.log("Car added successfully");
      res.redirect("/admin/displayCarDetails");
    } else if (button == "Fuel") {
      const { fuel_type, car_model_id } = req.body;
      const image = req.file;
      const fuel = await new Fuel({
        fuelType: fuel_type,
        fuelImage: image.filename,
        modelId: car_model_id,
        isDeleted: false,
        createdAt: Date.now(),
      });
      const saveData = await fuel.save();
      console.log("Fuel added successfully");
      res.redirect("/admin/displayCarDetails");
    } else {
      console.log("error");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getDisplayCarDetails = async (req, res, next) => {
  try {
    const carBrandData = await Manufacturer.find();

    res.render("admin/displayCarDetails", {
      path: "/displayCarDetails",
      carBrandData: carBrandData,
      pageTitle: "Car Details",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getDisplayCarModels = async (req, res, next) => {
  const brand_id = req.query.brand_id;
  try {
    const carModel = await Car.find({ brandId: brand_id });
    res.render("admin/displayCarModels", {
      path: "/displayCarDetails",
      carModel: carModel,
      brand_id: brand_id,
      pageTitle: "CarModels",
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getDisplayCarFuels = async (req, res, next) => {
  const car_model_id = req.query.car_model_id;
  try {
    const fuelModel = await Fuel.find({ modelId: car_model_id });
    res.render("admin/displayCarFuels", {
      path: "/displayCarDetails",
      fuelModel: fuelModel,
      car_model_id: car_model_id,
      pageTitle: "Car Fuel",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getDisplayServiceDetails = async (req, res, next) => {
  try {

    const serviceDetails = await ServiceDetail.find();

    res.render("admin/displayServiceDetails", {
      serviceDetailsData: serviceDetails,
      userName: userName,
      role: role,
      path: "/displayServiceDetails",
      pageTitle: "Display Service Details",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getAddServiceDetails = async (req, res, next) => {
  try {

    res.render("admin/addServiceDetails", {
      userName: userName,
      role: role,
      path: "/addServiceDetails",
      pageTitle: "Add Service Details",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postAddServiceDetails = async (req, res, next) => {
  try {
    const { service_name, service_description, service_list, service_time, service_price } = req.body;
    const image = req.file;
    let service_array = await service_list.split(',');
    const serviceDetail = await new ServiceDetail({
      service_name: service_name,
      service_image: image.filename,
      service_description: service_description,
      service_price: service_price,
      service_list: service_array,
      service_time: service_time,
      isDeleted: false,
    });
    const result = await serviceDetail.save();


    res.redirect("/admin/displayServiceDetails")
    //  {
    //   userName: userName,
    //   role: role,
    //   path: "/addServiceDetails",
    //   pageTitle: "Add Service Details",
    // });
  } catch (error) {
    console.log(error);
  }
};
