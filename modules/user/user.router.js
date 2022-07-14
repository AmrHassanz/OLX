const router = require('express').Router();
const { auth } = require('../../middlewear/auth');
const profileController = require('./controller/profile');
const endPoint = require('./user.endPoint');
const validators = require('./user.validation');
const validation = require('../../middlewear/validation');
const { myMulter, multerValidators, multerPath, HME } = require('../../services/multer');

// update password
router.patch('/profile/password', auth(endPoint.updatePassword) ,validation(validators.updatePassword), profileController.updatePassword);

// update email
router.patch('/profile/email', auth(endPoint.updateEmail), validation(validators.updateEmail), profileController.updateEmail);

// delete user
router.delete('/profile', auth(endPoint.deleteProfile), profileController.deleteProfile);

// Upload one picture    
router.patch('/profile/pic', auth(endPoint.profilePic),
    // ('users/profile/pic',['image/jpeg', 'image/jpg', 'image/png'])  
    myMulter(multerPath.profilePic, multerValidators.image).array('image', 5), HME,
    profileController.profilePic);

// Upload many pictures                                                                  
router.patch('/profile/cover', auth(endPoint.coverPic),
    // ('users/profile/cov',['image/jpeg', 'image/jpg', 'image/png'])  
    myMulter(multerPath.coverPic, multerValidators.image).array('image', 5), HME,
    profileController.coverPic);

// get all users
router.get('/',profileController.getAllUsers);


module.exports = router;