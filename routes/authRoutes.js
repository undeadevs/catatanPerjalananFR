const router = require('express').Router();
const {auth, login, register, logout} = require('../controllers/authController');

router.get('/auth', auth);
router.post('/login', login);
router.post('/register', register);
router.delete('/logout', logout);

module.exports = router;