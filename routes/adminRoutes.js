

const express = require('express');
const admin_route = express();
const session = require('express-session');
const config = require('../config/config');
const bodyParser = require('body-parser');
const path = require("path");
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

admin_route.use(session({ secret: config.sessionSecret }));
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));
admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

const adminController = require('../controllers/adminController');

admin_route.get('/', adminController.loadLogin);
admin_route.post('/', adminController.verifyLogin);
admin_route.get('/dashboard',adminController.adminDashboard)
admin_route.get('/home', adminController.loadDashboard);
//admin_route.get('/logout',adminController.logout)

admin_route.get('*', (req, res) => {
    res.redirect('/admin');
});

module.exports = admin_route;
