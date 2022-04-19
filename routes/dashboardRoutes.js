const router = require('express').Router();
const { dashboard } = require('../controllers/dashboardController');

router.get('/', dashboard);

module.exports = router;