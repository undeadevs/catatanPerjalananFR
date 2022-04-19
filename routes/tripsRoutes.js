const router = require('express').Router();
const { index, get, create, store, show, update, remove } = require('../controllers/tripsController');

router.get('/', index);
router.get('/get', get);
router.get('/add', create);
router.post('/add', store);
router.get('/:id', show);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;