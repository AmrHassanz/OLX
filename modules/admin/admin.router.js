const router = require('express').Router();
const { auth } = require('../../middlewear/auth');
const validation = require('../../middlewear/validation');
const validators = require('./admin.validation');
const endPoint = require('./admin.endPoint');
const adminController = require('./controller/admin');

// delete user
router.delete('/user/:id', validation(validators.deleteProfile), auth(endPoint.deleteProfile), adminController.deleteProfile);

// soft delete
router.patch('/user/:id', validation(validators.softDelete), auth(endPoint.softDelete), adminController.softDelete);


module.exports = router;