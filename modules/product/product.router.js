const router = require('express').Router();
// const { myMulter, multerValidators, multerPath, HME } = require('../../services/multer');
const { auth } = require('../../middlewear/auth');
const endPoint = require('./product.endPoint');
const productController = require('./controller/product');
const validation = require('../../middlewear/validation');
const validators = require('./product.validation');


// add product
router.post('/', auth(endPoint.addProduct), validation(validators.addProduct), productController.addProduct);

// update product
router.put('/:id', auth(endPoint.updateProduct), validation(validators.updateProduct), productController.updateProduct);

// delete product
router.delete('/:id', auth(endPoint.deleteProduct), validation(validators.deleteProduct), productController.deleteProduct);

// soft delete product
router.patch('/softDelete/:id', auth(endPoint.softDelete), validation(validators.softDelete), productController.softDelete);

// like and unlike product
router.patch('/like/:id', auth(endPoint.likeProduct), validation(validators.likeProduct), productController.likeProduct);

// add to wish list
router.patch('/wishList/:id', auth(endPoint.wishList), validation(validators.wishList), productController.wishList);

// hide product
router.patch('/hide/:id', auth(endPoint.hideProduct), validation(validators.hideProduct), productController.hideProduct);

module.exports = router;