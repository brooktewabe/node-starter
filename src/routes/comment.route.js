const express = require('express');

const router = express.Router();
const { commentController } = require('../controller');
const auth = require('../middlewares/auth');

router.post('/comment', auth, commentController.addComment);

module.exports = router;
