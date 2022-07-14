const router = require('express').Router();
const registerationController = require('./controller/registeration');
const validators = require('./auth.validation');
const validation = require('../../middlewear/validation');
const { auth } = require('../../middlewear/auth');
const endPoint = require('./auth.endPoint');

// signup
router.post('/signup', validation(validators.signup), registerationController.signUp);

// re-fresh email
router.get('/refreshEmail/:id', validation(validators.reConfirmationEmail), registerationController.refreshEmail);

// confirm email
router.get('/confirmEmail/:token', validation(validators.confirmEmail), registerationController.confirmEmail);

// login
router.post('/login', validation(validators.login), registerationController.login);

// forget password
// 1- send forget code
router.post('/sendCode', validation(validators.sendCode), registerationController.sendCode);
// 2- forget password
router.post('/forgetPassword', validation(validators.forgetPassword), registerationController.forgetPassword);

// logout
router.patch('/logout', auth(endPoint.logout), registerationController.logOut);


module.exports = router;