const express = require('express');
const { login, register, getMe } = require('../controllers/auth');
const multer  = require('multer');
const { protect } = require('../middleware/auth');

const upload = multer()
const router = express.Router();

router
    .post('/register', upload.none() ,register)
    .post('/login', upload.none(),login)
    .get('/me', upload.none(), protect, getMe);

module.exports = router;