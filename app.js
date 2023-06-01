require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

const port = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

const customerRouter = require('./routes/admin/customer.routes');
const userRouter = require('./routes/admin/user.routes');
const paymentRouter = require('./routes/admin/payment.routes');
const homeRouter = require('./routes/home.routes');
const error404 = require('./controllers/admin/error.controller');

const app = express();

app.use(cors());

// view engine setup
app.set('view engine', 'ejs');
app.set('views', 'views');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.originalname.match(/brand.*/)) {
      cb(null, 'public/car_details')
    }
    else if (file.originalname.match(/service.*/)) {
      cb(null, 'public/service_details')
    }
    else {
      cb(null, 'public/uploads')
    }
  },
  filename: (req, file, cb) => {
    if (file.originalname.match(/brand.*/)) {
      cb(null, file.originalname)
    }
    else  if (file.originalname.match(/service.*/)) {
      cb(null, file.originalname)
    }
    else {
      cb(null, file.originalname.split('.')[0] + "_" + Date.now() + "." + file.originalname.split('.')[1])
    }
    // cb(null,path.extname(file.fieldname)+"-"+Date.now())
  }
});
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(file.originalname);
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true)
  }
  else {
    cb('Error : Images only!')
  }
}

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"))

app.use(homeRouter);
app.use('/admin',userRouter);
app.use('/admin',customerRouter);
app.use('/admin',paymentRouter);

// handle 404 
app.use(error404.get404);

mongoose.connect(MONGODB_URI)
  .then(() => {
    // console.log("Database Connected");
    app.listen(port, () => {
      console.log(`Server Is Running On http://localhost:${port}`)
    })
  })
  .catch(err => console.log(err))