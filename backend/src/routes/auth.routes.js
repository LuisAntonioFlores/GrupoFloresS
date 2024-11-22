const express = require('express');
const { sendResetLink, resetPassword } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/forgot-password', sendResetLink);
router.post('/reset-password', resetPassword);

module.exports = router;
