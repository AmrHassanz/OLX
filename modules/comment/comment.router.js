const router = require('express').Router();
const { auth } = require('../../middlewear/auth');
const validation = require('../../middlewear/validation');
const validators = require('./comment.validation');
const endPoint = require('./comment.endPoint');
const commentController = require('./controller/comment');


// create comment
router.post('/:productId', auth(endPoint.createComment), validation(validators.createComment), commentController.createComment);

// reply on comment & reply on reply on comment
router.post('/:productId/:commentId/reply',auth(endPoint.replyOnComment),validation(validators.replyOnComment),commentController.replyOnComment);

// update comment
router.patch('/:productId/:commentId',auth(endPoint.updateComment),validation(validators.updateComment),commentController.updateComment);

// delete comment
router.delete('/:productId/:commentId',auth(endPoint.deleteComment),validation(validators.deleteComment),commentController.deleteComment);

// like and unlike comment
router.patch('/:productId/:commentId/like',auth(endPoint.likeComment),validation(validators.likeComment),commentController.likeComment);








module.exports = router;