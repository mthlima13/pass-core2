const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');
const userMiddleware = require('../middlewares/userMiddleware');

router.use(userMiddleware);

router.get('/', entryController.list);
router.post('/', entryController.create);
router.get('/:id/reveal', entryController.reveal);
router.patch('/:id/favorite', entryController.toggleFavorite);
router.put('/:id', entryController.update);
router.delete('/:id', entryController.delete);

module.exports = router;
